from datetime import datetime
from bson import ObjectId
from flask import Blueprint, request, jsonify, current_app, url_for, redirect, session
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models.user import User
from authlib.integrations.flask_client import OAuth
import os

auth_bp = Blueprint('auth', __name__)

# Initialize OAuth
oauth = OAuth()
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid profile email'}
)

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    db = current_app.db
    user_data = db.users.find_one({"email": email, "role": role})

    if user_data and User(db, user_data).check_password(password):
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

# Google OAuth Login Route
@auth_bp.route('/login/google', methods=['GET'])
def login_google():
    try:
        redirect_uri = url_for('auth.authorize_google', _external=True)
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Google OAuth Callback Route
@auth_bp.route('/authorize/google')
def authorize_google():
    token = google.authorize_access_token()
    userinfo_endpoint = google.server_metadata.get('userinfo_endpoint')
    resp = google.get(userinfo_endpoint)
    user_info = resp.json()
    username = user_info["email"]

    print(user_info)
    db = current_app.db
    user = db.users.find_one({"email": user_info["email"]})

    if not user:
        new_user = {
            "email": user_info["email"],
            "username": user_info["name"],
            "password_hash": None,  # No password for Google OAuth users
            "role": "reader",  # Default role for new users
            "created_at": datetime.now()
        }
        user_id = db.users.insert_one(new_user).inserted_id
    else:
        user_id = user["_id"]

    access_token = create_access_token(identity=str(user_id), additional_claims={"role": "reader"})
    refresh_token = create_refresh_token(identity=str(user_id))

    frontend_url = f"https://rentaread.vercel.app/auth-callback?access_token={access_token}&refresh_token={refresh_token}&role=reader"
    return redirect(frontend_url)

    # return jsonify({
    #     "access_token": access_token,
    #     "refresh_token": refresh_token,
    #     "role": "reader",
    #     "message": "Google login successful"
    # }), 200

# Refresh token route
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    data = request.json
    refresh_token = data.get('refresh_token')
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    
    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

# Get current user details
@auth_bp.route('/user', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = current_app.db.users.find_one(
        {"_id": ObjectId(current_user_id)}, 
        {"password_hash": 0}
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
    role = data.get('role')

    if not email or not username or not password or not role:
        return jsonify({"message": "Missing required fields"}), 400

    db = current_app.db
    existing_user = db.users.find_one({"email": email, "role": role})
    if existing_user:
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(password)
    new_user = {
        "email": email,
        "username": username,
        "password_hash": hashed_password,
        "role": role,
        "created_at": datetime.now()
    }

    result = db.users.insert_one(new_user)

    if result.inserted_id:
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"message": "User registration failed"}), 500
