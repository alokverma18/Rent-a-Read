from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import speech_recognition as sr
import os
import subprocess
import time
import shutil

speech_bp = Blueprint('speech', __name__)

# route to extract text from speech
@speech_bp.route('/convert', methods=['POST'])
@jwt_required()
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    input_path = "temp.webm"
    output_path = "temp.wav"

    # Save the uploaded file
    audio_file.save(input_path)

    # Convert WebM to WAV using FFmpeg with proper encoding
    try:
        subprocess.run([
            "ffmpeg", "-y", "-i", input_path,
            "-ac", "1", "-ar", "16000", "-sample_fmt", "s16",
            "-c:a", "pcm_s16le", output_path
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Audio conversion failed: {str(e)}"}), 500

    # Verify if WAV file exists and is valid
    if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
        return jsonify({"error": "WAV file conversion failed"}), 500

    # Process the converted WAV file with speech_recognition
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(output_path) as source:
            audio_data = recognizer.record(source)  # File is properly closed after this block

        # Recognize speech
        text = recognizer.recognize_google(audio_data)
        return jsonify({"text": text})

    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError:
        return jsonify({"error": "Speech Recognition service unavailable"}), 500
    finally:
        # Ensure files are deleted after a short delay
        time.sleep(0.5)  # Give Windows time to release the file
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
        except PermissionError:
            # If files are still locked, try moving them before deletion
            shutil.move(input_path, "delete_input.webm")
            shutil.move(output_path, "delete_output.wav")
            time.sleep(1)  # Wait before retrying deletion
            os.remove("delete_input.webm")
            os.remove("delete_output.wav")
