from flask import Blueprint, jsonify, request, current_app
from app.models.book import Book

book_bp = Blueprint('book', __name__)

@book_bp.route('/book', methods=['POST'])
def add_book():
    data = request.get_json()
    db = current_app.db
    book = Book(data['title'], data['author'], data['description'], data['s3_key'], data['owner_id'])
    book.save_to_db(db)
    return jsonify({"message": "Book added successfully!"}), 201
