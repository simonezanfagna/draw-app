from flask import jsonify, session
from functools import wraps
import re


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return jsonify({"message": "Access denied: login required"}), 401
        return f(*args, **kwargs)

    return decorated_function


def validate_email(email):
    email_valid = r"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    if re.search(email_valid, email):
        return True
    else:
        return False
