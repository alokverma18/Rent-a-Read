from flask import Blueprint, request, jsonify
from app.services.s3 import upload_file_to_s3
from flask import current_app

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Upload to S3
    file_url = upload_file_to_s3(file, current_app.config['S3_BUCKET'])

    if "http" not in file_url:
        return jsonify({'error': 'File upload failed'}), 500

    return jsonify({'file_url': file_url}), 200
