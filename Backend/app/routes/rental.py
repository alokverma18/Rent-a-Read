from flask import Blueprint, jsonify, request, current_app
from app.models.rental import Rental

rental_bp = Blueprint('rentals', __name__)

@rental_bp.route('/rent', methods=['POST'])
def rent_book():
    data = request.get_json()
    db = current_app.db
    rental = Rental(data['book_id'], data['user_id'], data['rental_duration'])
    rental.save_to_db(db)
    return jsonify({"message": "Book rented successfully!"}), 201

@rental_bp.route('/rentals', methods=['GET'])
def get_rentals():
    db = current_app.db
    rentals = Rental.get_all_rentals(db)
    return jsonify(rentals), 200
