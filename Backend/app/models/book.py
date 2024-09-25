from datetime import datetime
from bson import ObjectId

class Book:
    def __init__(self, title, author, isbn, published_date, price_per_hour, owner_id, description, cover_image_url, genres, availability):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.published_date = published_date
        self.price_per_hour = price_per_hour
        self.owner_id = ObjectId(owner_id)  # Convert to ObjectId
        self.description = description
        self.cover_image_url = cover_image_url
        self.genres = genres if genres else []  # Ensure genres is a list
        self.availability = availability
        self.created_at = datetime.utcnow()  # Automatically set the created_at field

    def save_to_db(self, db):
        # Create a document to insert into the database
        book_data = {
            "title": self.title,
            "author": self.author,
            "isbn": self.isbn,
            "published_date": self.published_date,
            "price_per_hour": self.price_per_hour,
            "owner_id": self.owner_id,
            "description": self.description,
            "cover_image_url": self.cover_image_url,
            "genres": self.genres,
            "availability": self.availability,
            "created_at": self.created_at
        }
        db.books.insert_one(book_data)  # Insert the book data into the database

    @classmethod
    def from_dict(cls, data):
        # Factory method to create a Book instance from a dictionary
        return cls(
            title=data.get('title'),
            author=data.get('author'),
            isbn=data.get('isbn'),
            published_date=data.get('published_date'),
            price_per_hour=data.get('price_per_hour'),
            owner_id=data.get('owner_id'),
            description=data.get('description'),
            cover_image_url=data.get('cover_image_url'),
            genres=data.get('genres', []),
            availability=data.get('availability', True)
        )

    @staticmethod
    def find_by_id(mongo, book_id):
        return mongo.db.books.find_one({'_id': book_id})
