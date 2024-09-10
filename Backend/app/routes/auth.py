from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from app.services.jwt import JWTService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    db = current_app.db
    user = User(data['username'], data['email'], data['password'], data['role'])
    user.save_to_db(db)
    return jsonify({"message": "User registered successfully!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = current_app.db
    user = User.find_by_email(db, data['email'])
    if user and User.check_password(data['password'], user['password_hash']):
        access_token = JWTService.create_token(user['_id'], user['role'])
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials!"}), 401
