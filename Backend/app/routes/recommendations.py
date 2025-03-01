from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter

recommend_bp = Blueprint("recommend", __name__)

@recommend_bp.route("/", methods=["GET"])
@jwt_required()
def get_recommendations():
    db = current_app.db
    user_id = ObjectId(get_jwt_identity())

    # Fetch rental history for all users
    rentals = list(db.rentals.find({}, {"_id": 0, "book_id": 1, "renter_id": 1}))
    if not rentals:
        return jsonify({"message": "No rental data available"}), 404

    # Fetch books and extract genres
    books = {str(book["_id"]): book for book in db.books.find({})}
    # print("BOOks", books)

    # Map users to genres they have rented
    user_genre_map = {}
    for rental in rentals:
        renter = str(rental["renter_id"])
        book_id = str(rental["book_id"])
        if book_id in books:
            genres = books[book_id].get("genres", [])
            user_genre_map.setdefault(renter, []).extend(genres)

    # Check if the user has rental history
    if str(user_id) not in user_genre_map:
        return jsonify({"message": "No rental history found"}), 404

    # Convert genre lists to feature vectors
    all_users = list(user_genre_map.keys())
    genre_vectors = pd.DataFrame.from_dict(user_genre_map, orient="index").fillna("").map(lambda x: ",".join(x))

    # Convert genres into one-hot encoding
    genre_matrix = pd.get_dummies(genre_vectors[0].str.split(",").explode()).groupby(level=0).sum()

    # Compute similarity scores
    similarity_matrix = cosine_similarity(genre_matrix)
    user_index = all_users.index(str(user_id))
    similar_users = similarity_matrix[user_index]

    # Get top similar users
    similar_user_ids = [all_users[i] for i in similar_users.argsort()[-5:][::-1] if all_users[i] != str(user_id)]

    # print("similar users: ", similar_user_ids)
    # Get books rented by similar users but not by the current user
    user_books = {str(r["book_id"]) for r in rentals if str(r["renter_id"]) == str(user_id)}
    # print("user books : ", user_books)

    recommended_books = set()

    for similar_user in similar_user_ids:
        similar_user_books = {str(r["book_id"]) for r in rentals if str(r["renter_id"]) == similar_user}
        recommended_books.update(similar_user_books - user_books)

    # If no recommendations found from similar users, recommend based on top genres
    if not recommended_books:
        print("No recommendations from similar users, falling back to genre-based recommendations")
        user_genres = Counter(user_genre_map[str(user_id)])
        top_genres = [genre for genre, _ in user_genres.most_common(3)]
        recommended_books.update(
            {str(book["_id"]) for book in books.values() if any(g in book["genres"] for g in top_genres)}
        )
        recommended_books -= user_books

    # Fetch book details from first 5 recommended books
    recommended_book_details = [
        {
        "_id": str(book["_id"]),
        "title": book["title"],
        "author": book["author"],
        "isbn": book["isbn"],
        "published_date": book["published_date"],
        "price_per_hour": book["price_per_hour"],
        "owner_id": str(book["owner_id"]),
        "description": book["description"],
        "cover_image_url": book["cover_image_url"],
        "genres": book["genres"],
        "availability": book["availability"],
        "created_at": book["created_at"]
        }
        
        for book_id, book in books.items() if book_id in list(recommended_books)[:5]
    ]
    # print("recommended_book_details ", recommended_book_details)

    return jsonify(recommended_book_details), 200
