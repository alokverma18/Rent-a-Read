from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, current_app
from flask_cors import cross_origin
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.rental import Rental
from app.services.s3 import generate_presigned_url
from bson import ObjectId

rental_bp = Blueprint('rentals', __name__)

@rental_bp.route('/rent', methods=['POST'])
def rent_book():
    data = request.get_json()
    db = current_app.db
    rental = Rental(data['book_id'], data['user_id'], data['rental_duration'])
    rental.save_to_db(db)
    return jsonify({"message": "Book rented successfully!"}), 201

# @rental_bp.route('/rentals', methods=['GET'])
# def get_rentals():
#     db = current_app.db
#     rentals = Rental.get_all_rentals(db)
#     return jsonify(rentals), 200

@rental_bp.route('/add', methods=['POST'])
def add_rental():
    data = request.json
    db = current_app.db
    renter_id = ObjectId(get_jwt_identity())
    print(data)
    book = db.books.find_one({"_id": ObjectId(data.get('bookId'))})
    print(book)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    rental_data = {
        "book_id": ObjectId(data.get('bookId')),
        "renter_id": renter_id,
        "rented_date": datetime.now(),
        "due_date": datetime.now() + timedelta(days=data.get('rental_duration', 1)), 
        "rental_fee": int(book['price_per_hour']) * (data.get('rental_duration', 1) * 24), 
        "access_url": generate_presigned_url(data.get('bookId'), expiration=data.get('rental_duration', 1) * 24 * 3600),
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
        result.append({
            "book_title": book['title'],
            "rented_date": rental['rented_date'],
            "due_date": rental['due_date'],
            "access_url": rental.get('access_url', ''),
            "access_status": status
        })
    return jsonify(result)
