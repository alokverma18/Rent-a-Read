from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            if current_user['role'] != required_role:
                return jsonify({"message": "Unauthorized"}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
