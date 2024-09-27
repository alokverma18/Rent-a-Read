import os
from dotenv import load_dotenv


load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

    # MongoDB Atlas Configuration
    MONGO_URI = os.getenv('MONGO_URI')
    MONGO_DBNAME = os.getenv('MONGO_DBNAME')

    # AWS S3 Configuration
    S3_BUCKET = os.getenv('S3_BUCKET')
    S3_KEY = os.getenv('S3_KEY')
    S3_SECRET = os.getenv('S3_SECRET')

    # Razorpay Configuration
    RAZORPAY_KEY = os.getenv('RAZORPAY_KEY')
    RAZORPAY_SECRET = os.getenv('RAZORPAY_SECRET')
