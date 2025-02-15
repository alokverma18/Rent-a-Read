from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

class User:
    def __init__(self, db, user_data):
        self.db = db
        self.collection = self.db.users
        self.data = user_data

    def create(self):
        self.data['password_hash'] = generate_password_hash(self.data['password'])
        self.collection.insert_one(self.data)

    @classmethod
    def find_by_email(cls, db, email):
        return db.users.find_one({"email": email})

    def check_password(self, password):
        return check_password_hash(self.data['password_hash'], password)

    def update(self, update_data):
        self.collection.update_one({'_id': ObjectId(self.data['_id'])}, {'$set': update_data})
