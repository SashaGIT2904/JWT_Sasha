"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import User, db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_bcrypt import Bcrypt

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

#LOGIN (funciona)
@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"msg": "Missing JSON in request"}), 400
    if 'email' not in body:
        return jsonify({"msg": "Missing email parameter"}), 400
    if 'password' not in body:
        return jsonify({"msg": "Missing password parameter"}), 400
    user = User.query.filter_by(email=body['email']).first()
    if user is None:
        return jsonify({"msg": "User not found"}), 404
    if not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({"msg": "Bad password"}), 401
    access_token = create_access_token(identity=user.email)
    return jsonify({'msg': 'Login successful', 'token': access_token}), 200

# PRIVADA (funciona)
@app.route('/api/private', methods=['GET'])
@jwt_required()
def privado():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    return jsonify({"msg": "This is a private route"}), 200

# Crear el Token de registro, cerrar sesión(limpiar el local storage), ruta privada

#REGISTER (funciona)
@app.route('/api/register', methods=['POST'])
def register():
    body = request.get_json()
    user = User()
    user.email = body['email']
    hash_password = bcrypt.generate_password_hash(
        body['password']).decode('utf-8')
    user.password = hash_password
    user.is_active = True
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({"msg": "Logout successful"}), 200

# Bcrypt


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
