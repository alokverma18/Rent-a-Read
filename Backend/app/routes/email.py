# send_weekly_newsletter.py
from flask import current_app
from sib_api_v3_sdk.rest import ApiException
from datetime import datetime, timedelta

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

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

def send_weekly_newsletter():
    # Configure API key
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key['api-key'] = BREVO_API_KEY

    # Create API client
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

    # Define email content
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": "dummy@example.com"}],  # required by API; ignored when sending to list
        template_id=5,
        params={
            "books": get_new_books_this_week(),
        },
        list_ids=[5],  # Send to all contacts in List ID 5
        headers={"X-Mailin-custom": "weekly-newsletter"},
        subject="📚 Weekly Book Picks Just For You!",
    )

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        print(f"Email sent successfully: {api_response}")
    except ApiException as e:
        print(f"Exception when sending email: {e}")

if __name__ == "__main__":
    send_weekly_newsletter()
