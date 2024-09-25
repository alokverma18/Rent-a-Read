import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from flask import current_app

def generate_presigned_url(file_key, expiration=3600):
    s3 = boto3.client(
        's3',
        aws_access_key_id=current_app.config['S3_KEY'],
        aws_secret_access_key=current_app.config['S3_SECRET']
    )

    try:
        url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': current_app.config['S3_BUCKET'], 'Key': file_key},
            ExpiresIn=expiration
        )
        return url
    except (NoCredentialsError, PartialCredentialsError):
        raise Exception("AWS credentials are not configured properly")

