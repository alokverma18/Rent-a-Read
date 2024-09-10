class Book:
    def __init__(self, title, author, description, s3_key, owner_id):
        self.title = title
        self.author = author
        self.description = description
        self.s3_key = s3_key  # Key for the eBook stored in S3
        self.owner_id = owner_id  # BookOwner ID

    def save_to_db(self, mongo):
        mongo.db.books.insert_one({
            'title': self.title,
            'author': self.author,
            'description': self.description,
            's3_key': self.s3_key,
            'owner_id': self.owner_id
        })

    @staticmethod
    def find_by_id(mongo, book_id):
        return mongo.db.books.find_one({'_id': book_id})
