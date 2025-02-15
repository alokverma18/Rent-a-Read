from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from bson.json_util import dumps

users_bp = Blueprint('users', __name__)

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.json

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username or not email or not password or not role:
        return jsonify({"message": "All fields are required"}), 400

    user_data = {
        "username": username,
        "email": email,
        "password": password,
        "role": role,
        "created_at": datetime.utcnow()
    }

    db = current_app.db
    user = User(db, user_data)

    if User.find_by_email(db, email):
        return jsonify({"message": "User already exists"}), 400

    user.create()
    return jsonify({"message": "User registered successfully"}), 201
