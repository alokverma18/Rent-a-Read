from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.book import Book
from bson import ObjectId

owner_bp = Blueprint('owner', __name__)



@owner_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    owner_id = get_jwt_identity()  
    db = current_app.db
    
    total_books = db.books.count_documents({'owner_id': owner_id})
    active_rentals = db.rentals.count_documents({'owner_id': owner_id, 'status': 'active'})
    
    total_earnings = list(db.rentals.aggregate([
        {'$match': {'owner_id': owner_id}},
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
    owner_id = get_jwt_identity() 
    db = current_app.db
    rentals = db.rentals.find({'owner_id': owner_id}).sort('rented_date', -1).limit(10)
    return jsonify(list(rentals))
