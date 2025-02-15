import boto3
def generate_signed_url():
    # Specify the AWS region
    region_name = 'ap-south-1'  # Replace with your bucket's region

    # Initialize the S3 client with the specified region
    s3 = boto3.client('s3',aws_access_key_id='',
    aws_secret_access_key='', region_name=region_name)
    
    bucket_name = 'mybookrental'
    object_key = 'books/Reckless'

    try:
        # Generate the signed URL with the appropriate signing mechanism
        signed_url = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_key},
            ExpiresIn=3600  # URL expiration in seconds
        )
        print(signed_url)
        
    except Exception as e:
        return e

generate_signed_url()
