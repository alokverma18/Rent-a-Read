from flask import Blueprint, jsonify, current_app
from bson.json_util import dumps  # Importing from bson to handle ObjectId

test_bp = Blueprint('test', __name__)

@test_bp.route('/mongo', methods=['GET'])
def test_mongo():
    db = current_app.db
    test_collection = db.test_collection
    
    # Insert a test document
    test_document = {"name": "test", "message": "MongoDB connection is working"}
    inserted_id = test_collection.insert_one(test_document).inserted_id
    
    # Fetch the inserted document
    result = test_collection.find_one({"_id": inserted_id})
    
    # Convert result to JSON string using dumps from bson.json_util
    result_json = dumps(result)
    
    return jsonify({
        "message": "MongoDB connection is working!",
        "data": result_json
    }), 200




# import boto3
# from flask import Blueprint, jsonify, current_app
# from botocore.exceptions import NoCredentialsError

# test_bp = Blueprint('test', __name__)

# @test_bp.route('/s3', methods=['POST'])
# def test_s3():
#     s3 = boto3.client(
#         's3',
#         aws_access_key_id=current_app.config['S3_KEY'],
#         aws_secret_access_key=current_app.config['S3_SECRET']
#     )
    
#     # Sample file content
#     content = b"This is a test file for S3 connection"
#     bucket_name = current_app.config['S3_BUCKET']
#     file_name = "test_s3_file.txt"
    
#     try:
#         # Upload file to S3
#         s3.put_object(
#     Bucket=bucket_name,
#     Key=file_name,
#     Body=content,
#     ACL='public-read'
# )
#         # Generate S3 file URL
#         file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        
#         return jsonify({
#             "message": "AWS S3 connection is working!",
#             "file_url": file_url
#         }), 200
#     except NoCredentialsError:
#         return jsonify({
#             "message": "Credentials not available!"
#         }), 400
