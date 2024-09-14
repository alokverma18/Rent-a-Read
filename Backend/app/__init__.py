from flask import Flask
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from app.config import Config
from app.routes.auth import auth_bp
from app.routes.book import book_bp
from app.routes.rental import rental_bp
from app.routes.streaming import streaming_bp
from app.routes.test import test_bp 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize JWT
    jwt = JWTManager(app)

    # Initialize MongoDB Client
    client = MongoClient(app.config['MONGO_URI'])
    app.db = client[app.config['MONGO_DBNAME']]

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(book_bp, url_prefix="/books")
    app.register_blueprint(rental_bp, url_prefix="/rentals")
    app.register_blueprint(streaming_bp, url_prefix="/stream")
    app.register_blueprint(test_bp, url_prefix="/test")

    return app
