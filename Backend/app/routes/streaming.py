from flask import Blueprint, jsonify, request, Response
from app.services.s3 import generate_presigned_url
import requests

streaming_bp = Blueprint('streaming', __name__)

@streaming_bp.route('/content', methods=['GET'])
def stream_content():
    file_key = request.args.get('file_key')
    
    if not file_key:
        return jsonify({"error": "Missing file_key parameter"}), 400
    
    try:
        url = generate_presigned_url(file_key)
        response = requests.get(url, stream=True)

        if response.status_code == 200:
            return Response(response.iter_content(chunk_size=8192), content_type=response.headers['Content-Type'])
        else:
            return jsonify({"error": "Failed to fetch content"}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500
