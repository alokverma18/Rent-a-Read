from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

user_bp = Blueprint('profile', __name__)

def get_user_by_id(user_id):
    db = current_app.db
    user = db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
    return user

@user_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = get_user_by_id(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify({
        "username": user["username"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user["created_at"],
        "profile_picture": user.get("profile_picture")
    }), 200

# Update user profile
@user_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    data = request.json
    db = current_app.db
    
    update_data = {}
    if 'username' in data:
        update_data['username'] = data['username']
    if 'email' in data:
        update_data['email'] = data['email']
    
    if update_data:
        db.users.update_one({"_id": ObjectId(current_user_id)}, {"$set": update_data})
    
    return jsonify({"message": "Profile updated successfully"}), 200

# update profile picture upload to s3 and get the url
@user_bp.route('/profile-picture', methods=['POST'])
@jwt_required()
def update_profile_picture():
    current_user_id = get_jwt_identity()
    db = current_app.db
    user = db.users.find_one({"_id": ObjectId(current_user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    profile_picture = request.files.get('profile_picture')
    if not profile_picture:
        return jsonify({"message": "Missing profile picture"}), 400
    
    s3 = current_app.s3
    bucket = current_app.config['S3_BUCKET']
    s3_filename = f"profile_pictures/{current_user_id}/{datetime.now().isoformat()}_{profile_picture.filename}"
    s3.upload_fileobj(profile_picture, bucket, s3_filename,  ExtraArgs={'ACL': 'public-read'})
    
    s3_url = f"https://{bucket}.s3.amazonaws.com/{s3_filename}"
    db.users.update_one({"_id": ObjectId(current_user_id)}, {"$set": {"profile_picture": s3_url}})
    
    return jsonify({"message": "Profile picture updated successfully", "profile_picture": s3_url}), 200


# Change password
@user_bp.route('/password', methods=['PUT'])
@jwt_required()
def change_password():
    current_user_id = get_jwt_identity()
    data = request.json
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    
    if not current_password or not new_password:
        return jsonify({"message": "Missing required fields"}), 400
    
    db = current_app.db
    user = db.users.find_one({"_id": ObjectId(current_user_id)})
    
    if not user or not user.get('password_hash') or not check_password_hash(user['password_hash'], current_password):
        return jsonify({"message": "Invalid current password"}), 401
    
    hashed_new_password = generate_password_hash(new_password)
    db.users.update_one({"_id": ObjectId(current_user_id)}, {"$set": {"password_hash": hashed_new_password}})
    
    return jsonify({"message": "Password updated successfully"}), 200
