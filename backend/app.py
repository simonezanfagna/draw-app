from datetime import timedelta
from flask import (
    Flask,
    request,
    jsonify,
    session,
)
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
from flask_session import Session
from helpers import login_required, validate_email
from flask_cors import CORS
from PIL import Image
import io
import base64

app = Flask(__name__)


app.config["SECRET_KEY"] = "a_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///myapp.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(days=7)
app.config["SESSION_TYPE"] = "filesystem"
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
)


Session(app)

CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost"}},
)


db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)
    drawings = db.relationship("Drawing", backref="author", lazy="dynamic")

    def set_password(self, password):
        self.hashed_password = generate_password_hash(
            password, method="scrypt", salt_length=16
        )

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)


class Drawing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.LargeBinary, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


@app.route("/api/@me")
@login_required
def getUserFromSession():
    user_id = session["user_id"]
    user = User.query.filter_by(id=user_id).first()
    return (
        jsonify(
            {
                "message": "User logged in successfully",
                "user": user.name,
            }
        ),
        201,
    )


@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    confirmation = data.get("confirmation")

    if not email or not password or not name or not confirmation:
        return (
            jsonify({"message": "Email, password, confirmation and name are required"}),
            400,
        )

    if not validate_email(email):
        return jsonify({"message": "Invalid email format"}), 400

    if not (password == confirmation):
        return (
            jsonify({"message": "password and confirmation password are different"}),
            400,
        )

    existing_user = User.query.filter_by(email=email).first()

    if existing_user is not None:
        return jsonify({"message": "Email already registered"}), 409

    new_user = User(email=email, name=name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    user = User.query.filter_by(email=email).first()

    session["user_id"] = user.id

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": user.name,
            }
        ),
        201,
    )


@app.route("/api/login", methods=["POST"])
def login():
    # Forget any user_id
    session.clear()

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Ensure email and password were submitted
    if not email or not password:
        return jsonify({"message": "Email, password are required"}), 400

    # Query database for email
    user = User.query.filter_by(email=email).first()

    # Ensure email exists and password is correct
    if not user or not user.check_password(password):
        return jsonify({"message": "invalid email and/or password"}), 401

    # Remember which user has logged in
    session["user_id"] = user.id

    # Return user
    return (
        jsonify(
            {
                "message": "User logged in successfully",
                "user": user.name,
            }
        ),
        201,
    )


@app.route("/api/logout", methods=["POST"])
def logout():

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return (
        jsonify(
            {
                "message": "User logged out successfully",
                "user": "empty",
            }
        ),
        201,
    )


@app.route("/api/addDrawing", methods=["POST"])
@login_required
def add_drawing():
    # Receives the image as a base64 string
    data = request.get_json()
    image_data = data["image"]
    background_color = data["backgroundColor"]

    try:

        image_data = base64.b64decode(image_data.split(",")[1])
        # Base64 to binary decoding
        with Image.open(io.BytesIO(image_data)) as image:
            if image.size != (1280, 720):
                return (
                    jsonify({"message": "Invalid image dimensions, required 1280x720"}),
                    400,
                )

            if background_color == "white":
                background_color = "#FFFFFF"
            else:
                background_color = "#000000"

            background = Image.new("RGBA", (1280, 720), background_color)
            background.paste(image, (0, 0), image)

            image_bytes = io.BytesIO()
            background.save(image_bytes, format="PNG")
            image_bytes = image_bytes.getvalue()

            new_drawing = Drawing(data=image_bytes, user_id=session["user_id"])
            db.session.add(new_drawing)
            db.session.commit()

            return (
                jsonify(
                    {"message": "Drawing saved successfully", "image": new_drawing.id}
                ),
                200,
            )
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/api/getAllDrawings", methods=["GET"])
@login_required
def get_all_drawings():
    user_id = session["user_id"]
    drawings = Drawing.query.filter_by(user_id=user_id).all()
    drawings_data = []
    for drawing in drawings:

        img_data = base64.b64encode(drawing.data).decode("utf-8")

        drawings_data.append(
            {"id": drawing.id, "image_data": f"data:image/png;base64,{img_data}"}
        )

    return jsonify(drawings_data), 200


@app.route("/api/deleteDrawing", methods=["POST"])
@login_required
def delete_drawing():
    data = request.get_json()
    drawing_id = data["id"]

    drawing = Drawing.query.get(drawing_id)
    if drawing and drawing.user_id == session["user_id"]:
        db.session.delete(drawing)
        db.session.commit()
        return jsonify({"message": "Drawing deleted successfully"}), 200
    return jsonify({"message": "Drawing not found or unauthorized"}), 404


@app.route("/api/downloadDrawing/<int:drawing_id>", methods=["GET"])
@login_required
def download_drawing(drawing_id):
    drawing = Drawing.query.get(drawing_id)
    if drawing and drawing.user_id == session["user_id"]:
        img_data = base64.b64encode(drawing.data).decode("utf-8")
        return jsonify({"filename": f"drawing_{drawing_id}.png", "data": img_data}), 200
    return jsonify({"message": "Drawing not found or unauthorized"}), 404


@app.route("/debug/session")
def debug_session():
    app.logger.debug("Session Data: %s", dict(session))
    return jsonify(dict(session)), 200


# initial migrations with Flask-Migrate
with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
