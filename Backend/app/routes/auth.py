from datetime import datetime
from bson import ObjectId
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

# Login route
@auth_bp.route('/login', methods=['POST'])

def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # Get role from the request

    db = current_app.db
    
    # Find user by email and role
    user_data = db.users.find_one({"email": email, "role": role})  

    if user_data and User(db, user_data).check_password(password):
        # Create JWT tokens
        access_token = create_access_token(identity=str(user_data['_id']), additional_claims={"role": user_data["role"]}) 
        refresh_token = create_refresh_token(identity=str(user_data['_id']))
        
        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "role": user_data['role'],
            "message": "Login successful"
        }), 200
    else:
        return jsonify({"message": "Invalid credentials or role"}), 401

# Refresh token route
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    data = request.json
    refresh_token = data.get('refresh_token')  # Get refresh token from the body
    
    # Get identity from the JWT refresh token
    identity = get_jwt_identity()
    
    # Create a new access token
    access_token = create_access_token(identity=identity)
    
    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

# Get current user details
@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_current_user():
    # Get the user ID from the JWT token
    current_user_id = get_jwt_identity()

    # Fetch the user details from the database using the user ID
    user = current_app.db.users.find_one(
        {"_id": ObjectId(current_user_id)},  # Convert string ID to ObjectId
        {"password_hash": 0}  # Exclude password_hash
    )

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user["created_at"]
    }), 200



# User registration route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # Expecting 'reader' or 'bookowner'

    # Check if all fields are present
    if not email or not username or not password or not role:
        return jsonify({"message": "Missing required fields"}), 400

    db = current_app.db

    # Check if user with the given email already exists
    existing_user = db.users.find_one({"email": email, "role": role})
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    # Hash the password
    hashed_password = generate_password_hash(password)

    # Create a new user record
    new_user = {
        "email": email,
        "username": username,
        "password_hash": hashed_password,
        "role": role,
        "created_at": datetime.now()
    }

    # Insert the user into the database
    result = db.users.insert_one(new_user)

    if result.inserted_id:
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"message": "User registration failed"}), 500
