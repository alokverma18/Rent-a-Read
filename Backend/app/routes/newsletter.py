from flask import Blueprint, request, jsonify, current_app
import requests
import os
from dotenv import load_dotenv
from sib_api_v3_sdk import ContactsApi, TransactionalEmailsApi, SendSmtpEmail
from datetime import datetime, timedelta

newsletter_bp = Blueprint('books', __name__)

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
BREVO_URL = "https://api.brevo.com/v3/contacts"

db = current_app.db
books = db.books.find()

def get_new_books_this_week():
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    new_books = books.find({"created_at": {"$gte": one_week_ago}})
    return [{
        "title": b["title"],
        "author": b["author"],
        "genre": ", ".join(b["genres"]),
        "url": f"https://rentaread.vercel.app/book/{str(b['_id'])}"
    } for b in new_books]

contacts_api = ContactsApi(sib_api_v3_sdk.ApiClient(configuration))
contacts = contacts_api.get_contacts_from_list(list_id=5).contacts
emails = [c.email for c in contacts]






def send_weekly_email(emails, books):
    api_instance = TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    for email in emails:
        send_email = SendSmtpEmail(
            to=[{"email": email}],
            template_id=5,
            params={"books": books}
        )
        api_instance.send_transac_email(send_email)


headers = {
    "api-key": BREVO_API_KEY,
    "Content-Type": "application/json"
}

@newsletter_bp.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    payload = {
        "email": email,
        "listIds": [int(BREVO_LIST_ID)],
        "updateEnabled": True
    }

    response = requests.post(BREVO_URL, headers=headers, json=payload)

    if response.status_code == 201 or response.status_code == 204:
        return jsonify({"message": "Subscribed successfully"}), 200
    else:
        return jsonify({"error": "Failed to subscribe", "details": response.json()}), 500

