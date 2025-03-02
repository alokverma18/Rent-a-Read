from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from bson import ObjectId
import os
from werkzeug.utils import secure_filename
from app.services.s3 import s3

owner_bp = Blueprint('owner', __name__)

@owner_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    owner_id = ObjectId(get_jwt_identity())
    db = current_app.db
    
    # Get the list of book IDs owned by the owner
    owner_books = db.books.find({'owner_id': owner_id}, {'_id': 1})
    book_ids = [book['_id'] for book in owner_books]
    
    # Total books owned by the owner
    total_books = len(book_ids)
    
    # Count active rentals by checking if due_date is in the future
    active_rentals = db.rentals.count_documents({'book_id': {'$in': book_ids}, 'due_date': {'$gt': datetime.now()}})
    
    # Calculate total earnings from those rentals
    total_earnings = list(db.rentals.aggregate([
        {'$match': {'book_id': {'$in': book_ids}}},
        {'$group': {'_id': None, 'total': {'$sum': '$rental_fee'}}}
    ]))
    
    total_earnings_value = total_earnings[0]['total'] if total_earnings else 0
    
    return jsonify({
        'total_books': total_books,
        'active_rentals': active_rentals,
        'total_earnings': total_earnings_value
    })




@owner_bp.route('/recent-rentals', methods=['GET'])
@jwt_required()
def get_recent_rentals():
    owner_id = ObjectId(get_jwt_identity())
    db = current_app.db
    
    # Find books owned by the owner
    owner_books = db.books.find({'owner_id': owner_id}, {'_id': 1})
    book_ids = [book['_id'] for book in owner_books]
    
    # Find recent rentals for these books
    rentals = db.rentals.find({'book_id': {'$in': book_ids}}).sort('rented_date', -1).limit(10)
    
    # Prepare the list of rentals to return
    recent_rentals = []
    
    for rental in rentals:
        # Find the book title
        book = db.books.find_one({'_id': rental['book_id']}, {'title': 1})
        book_title = book['title'] if book else 'Unknown'
        
        # Find the renter's name
        renter = db.users.find_one({'_id': rental['renter_id']}, {'username': 1})
        renter_name = renter['username'] if renter else 'Unknown'
        
        # Append the relevant data to the result
        recent_rentals.append({
            'book_title': book_title,
            'renter': renter_name,
            'rented_date': rental['rented_date'],
            'due_date': rental['due_date']
        })
    
    return jsonify(recent_rentals), 200




@owner_bp.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    owner_id = ObjectId(get_jwt_identity())
    db = current_app.db
    
    books = db.books.find({'owner_id': owner_id})

    books_list = [
        {
            "_id": str(book["_id"]),
            "title": book["title"],
            "author": book["author"],
            "isbn": book["isbn"],
            "published_date": book["published_date"],
            "price_per_hour": book["price_per_hour"],
            "owner_id": str(book["owner_id"]),
            "description": book["description"],
            "cover_image_url": book["cover_image_url"],
            "genres": book["genres"],
            "availability": book["availability"],
            "created_at": book["created_at"]
        }
        for book in books
    ]
    
    return jsonify(books_list), 200

@owner_bp.route('/book', methods=['POST'])
@jwt_required()
def add_book():
    data = request.form
    file = request.files['file']  # Get the file from request

    # Upload the file to S3
    s3_key = f"books/{data.get('title')}"
    bucket_name = current_app.config['S3_BUCKET']
    
    s3.upload_fileobj(file, bucket_name, s3_key)

    print(data)

    # Create the book record
    new_book = Book(
        title=data.get('title'),
        author=data.get('author'),
        isbn=data.get('isbn'),
        published_date=datetime.strptime(data.get('published_date'), '%Y-%m-%d'),
        price_per_hour=data.get('price_per_hour'),
        owner_id=get_jwt_identity(),
        description=data.get('description'),
        cover_image_url=data.get('cover_image_url'),
        genres=data.get('genres').split(','),
        availability=data.get('availability', True),
    )

    db = current_app.db
    new_book.save_to_db(db)
    
    return jsonify({"message": "Book uploaded successfully!"}), 201


@owner_bp.route('/book/<book_id>', methods=['PUT'])
@jwt_required()
def update_book(book_id):
    data = request.form
    print(data)

    file = request.files['file']  # Get the file from request

    # Upload the file to S3
    s3_key = f"books/{data.get('title')}"
    bucket_name = current_app.config['S3_BUCKET']
    
    s3.upload_fileobj(file, bucket_name, s3_key)

    owner_id = ObjectId(get_jwt_identity())

    db = current_app.db
    
    db.books.update_one(
        {'_id': ObjectId(book_id), 'owner_id': owner_id},
        {'$set': {
            'title': data['title'],
            'author': data['author'],
            'isbn': data['isbn'],
            'published_date': datetime.strptime(data['published_date'], '%a %b %d %Y'),
            'price_per_hour': data['price_per_hour'],
            'description': data['description'],
            'cover_image_url': data['cover_image_url'],
            'genres': data['genres'].split(', '),
            'availability': data['availability']
        }}
    )
    return jsonify({"message": "Book updated successfully!"})

@owner_bp.route('/book/<book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    owner_id = ObjectId(get_jwt_identity()) 
    db = current_app.db

    book = db.books.find_one({'_id': ObjectId(book_id)}, {'title': 1})
    book_title = book['title']
    
    db.books.delete_one({'_id': ObjectId(book_id), 'owner_id': owner_id})

    s3_key = f"books/{book_title}"
    bucket_name = current_app.config['S3_BUCKET']
    
    s3.delete_object(Bucket=bucket_name, Key=s3_key)
    book_title = book_title.replace(" ", "_")
    s3.delete_object(Bucket=bucket_name, Key=f"{book_title}.jpg")
    
    return jsonify({"message": "Book deleted successfully!"})

@owner_bp.route('/rentals', methods=['GET'])
@jwt_required()
def get_rentals_by_owner():
    owner_id = ObjectId(get_jwt_identity())
    db = current_app.db
    
    # Find books owned by the owner
    owner_books = db.books.find({'owner_id': owner_id}, {'_id': 1})
    book_ids = [book['_id'] for book in owner_books]
    
    # Find recent rentals for these books
    rentals = db.rentals.find({'book_id': {'$in': book_ids}}).sort('rented_date', -1)
    
    # Prepare the list of rentals to return
    result = []
    
    for rental in rentals:
        # Find the book title
        book = db.books.find_one({'_id': rental['book_id']}, {'title': 1})
        book_title = book['title'] if book else 'Unknown'
        
        # Find the renter's name
        renter = db.users.find_one({'_id': rental['renter_id']}, {'username': 1})
        renter_name = renter['username'] if renter else 'Unknown'
        
        # Append the relevant data to the result
        result.append({
            'book_title': book_title,
            'renter': renter_name,
            'rented_date': rental['rented_date'],
            'due_date': rental['due_date']
        })
    
    return jsonify(result), 200

@owner_bp.route('/upload-cover-image', methods=['POST'])
@jwt_required()
def upload_cover_image():
    file = request.files['file']
    print(file)
    if not file:
        return jsonify({"error": "No file provided"}), 400
    
    bucket_name = os.getenv('S3_BUCKET')
    file_key = secure_filename(file.filename)

    try:
        s3.upload_fileobj(file, bucket_name, file_key, ExtraArgs={'ACL': 'public-read'})
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"
        return jsonify({"url": file_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500