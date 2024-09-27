import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from flask import current_app
from app.config import Config

s3 = boto3.client(
    's3',
    aws_access_key_id=Config.S3_KEY,
    aws_secret_access_key=Config.S3_SECRET
)
bucket_name = Config.S3_BUCKET

def generate_presigned_url(file_key, expiration=3600):
    try:
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': file_key},
            ExpiresIn=expiration
        )
        return url
    except (NoCredentialsError, PartialCredentialsError):
        raise Exception("AWS credentials are not configured properly")
    
    except Exception as e:
        raise Exception(f"An error occurred: {e}")

