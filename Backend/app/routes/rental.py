from datetime import datetime, timedelta
import fitz
from flask import Blueprint, jsonify, request, current_app
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
import requests
from app.models.rental import Rental
from app.services.s3 import generate_presigned_url
from bson import ObjectId
import os

rental_bp = Blueprint('rentals', __name__)

@rental_bp.route('/rent', methods=['POST'])
def rent_book():
    data = request.get_json()
    db = current_app.db
    rental = Rental(data['book_id'], data['user_id'], data['rental_duration'])
    rental.save_to_db(db)
    return jsonify({"message": "Book rented successfully!"}), 201

@rental_bp.route('/add', methods=['POST'])
@jwt_required()
def add_rental():
    data = request.json
    db = current_app.db
    renter_id = ObjectId(get_jwt_identity())
    print(data)
    book = db.books.find_one({"_id": ObjectId(data['bookId'])})
    print(data['bookId'])
    print(ObjectId(data['bookId']))
    print(book)
    if not book:
        return jsonify({"error": "Book not found"}), 420

    rental_data = {
        "book_id": ObjectId(data['bookId']),
        "renter_id": renter_id,
        "rented_date": datetime.now(),
        "due_date": datetime.now() + timedelta(days=data.get('rental_duration', 1)), 
        "rental_fee": int(book['price_per_hour']) * (data.get('rental_duration', 1) * 24), 
        "access_url": generate_presigned_url(book['title'], expiration=data.get('rental_duration', 1) * 24 * 3600),
        "transaction_id": data.get('transactionId', None),
    }
    db.rentals.insert_one(rental_data)
    return jsonify({"message": "Rental added successfully!"}), 201

@rental_bp.route('', methods=['GET'])
@jwt_required()
def get_rentals():
    db = current_app.db
    reader_id = ObjectId(get_jwt_identity())
    rentals = db.rentals.find({"renter_id": reader_id})
    result = []
    for rental in rentals:
        book = db.books.find_one({"_id": rental['book_id']})
        if (rental['due_date'] - datetime.now()).days < 0:
            status = 'false'
        else:
            status = 'active'
        if book:
            result.append({
            "book_title": book['title'],
            "rented_date": rental['rented_date'],
            "due_date": rental['due_date'],
            "access_url": rental.get('access_url', ''),
            "access_status": status
        })
    return jsonify(result)

# route to extract text from url
@rental_bp.route('/extract', methods=['POST'])
@jwt_required()
def extract_text():
    data = request.json
    pdf_url = data.get('url')
    
    if not pdf_url:
        return jsonify({'error': 'PDF URL is required'}), 400
    
    response = requests.get(pdf_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch PDF'}), 500

    temp_file = 'temp.pdf'
    try:
        with open(temp_file, 'wb') as f:
            f.write(response.content)

        # Open and extract text
        doc = fitz.open(temp_file)
        text = ''.join(page.get_text() for page in doc)
        doc.close()  # Make sure to close the document before deleting the file

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)  # Delete the file after processing

    return jsonify({'text': text})