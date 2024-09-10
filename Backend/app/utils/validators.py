import re

def is_valid_email(email):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email) is not None

def is_valid_role(role):
    return role in ['customer', 'admin', 'bookowner']
