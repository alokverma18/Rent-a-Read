from flask_jwt_extended import get_jwt_identity
from functools import wraps
from flask import jsonify

def role_required(allowed_roles):
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            identity = get_jwt_identity()
            role = identity.get('role')

            if role not in allowed_roles:
                return jsonify({"message": "Access forbidden: insufficient privileges"}), 403
            
            return fn(*args, **kwargs)
        return decorated_view
    return wrapper
