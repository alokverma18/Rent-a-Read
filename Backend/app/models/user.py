from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, username, email, password, role):
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role

    @staticmethod
    def find_by_email(db, email):
        return db.users.find_one({'email': email})

    def save_to_db(self, db):
        db.users.insert_one({
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash,
            'role': self.role
        })

    @staticmethod
    def check_password(password, hashed_password):
        return check_password_hash(hashed_password, password)
