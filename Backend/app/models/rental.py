from datetime import datetime, timedelta

class Rental:
    def __init__(self, customer_id, book_id, rental_start_time, rental_end_time):
        self.customer_id = customer_id
        self.book_id = book_id
        self.rental_start_time = rental_start_time
        self.rental_end_time = rental_end_time

    def save_to_db(self, mongo):
        mongo.db.rentals.insert_one({
            'customer_id': self.customer_id,
            'book_id': self.book_id,
            'rental_start_time': self.rental_start_time,
            'rental_end_time': self.rental_end_time
        })

    @staticmethod
    def find_by_customer_and_book(mongo, customer_id, book_id):
        return mongo.db.rentals.find_one({
            'customer_id': customer_id,
            'book_id': book_id
        })
