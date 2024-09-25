from flask import Blueprint, jsonify, request, current_app
from app.models.book import Book
from bson import ObjectId

book_bp = Blueprint('books', __name__)

# Route to add a new book
@book_bp.route('', methods=['POST'])
def add_book():
    data = request.get_json()
    book = Book(
        title=data['title'],
        author=data['author'],
        isbn=data['isbn'],
        published_date=data['published_date'],
        price_per_hour=data['price_per_hour'],
        owner_id=data['owner_id'],
        description=data['description'],
        cover_image_url=data['cover_image_url'],
        genres=data.get('genres', []),  # Handle missing genres
        availability=data.get('availability', True)  # Default to True
    )
    db = current_app.db
    book.save_to_db(db)
    return jsonify({"message": "Book added successfully!"}), 201

# Route to get all books
@book_bp.route('', methods=['GET'])
def get_books():
    db = current_app.db
    books = db.books.find()
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

# Route to get a specific book by ID
@book_bp.route('/<book_id>', methods=['GET'])
def get_book(book_id):
    db = current_app.db
    book = db.books.find_one({"_id": ObjectId(book_id)})
    if not book:
        return jsonify({"message": "Book not found"}), 404
    
    book_data = {
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
    return jsonify(book_data), 200

# Route to update a book by ID
@book_bp.route('/<book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.get_json()
    db = current_app.db
    update_fields = {k: v for k, v in data.items() if k in [
        "title", "author", "isbn", "published_date", 
        "price_per_hour", "description", "cover_image_url", 
        "genres", "availability"
    ]}
    
    result = db.books.update_one({"_id": ObjectId(book_id)}, {"$set": update_fields})
    if result.modified_count == 0:
        return jsonify({"message": "No changes made or book not found"}), 404
    
    return jsonify({"message": "Book updated successfully!"}), 200

# Route to delete a book by ID
@book_bp.route('/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    db = current_app.db
    result = db.books.delete_one({"_id": ObjectId(book_id)})
    if result.deleted_count == 0:
        return jsonify({"message": "Book not found"}), 404
    
    return jsonify({"message": "Book deleted successfully!"}), 200
