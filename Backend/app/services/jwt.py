from flask_jwt_extended import create_access_token, get_jwt_identity
from datetime import timedelta

class JWTService:
    @staticmethod
    def create_token(user_id, role):
        expires = timedelta(hours=12)  # Token expiration time
        return create_access_token(identity={"user_id": user_id, "role": role}, expires_delta=expires)

    @staticmethod
    def get_current_user():
        return get_jwt_identity()
