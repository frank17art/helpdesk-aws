from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import User
import bcrypt

users_bp = Blueprint('users', __name__)

def get_current_user():
    user_id = int(get_jwt_identity())
    return User.query.get(user_id)

@users_bp.route('', methods=['GET'])
@jwt_required()
def get_users():
    user = get_current_user()
    if user.role != 'admin':
        return jsonify({'error': 'Non autorise'}), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])

@users_bp.route('/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user(user_id):
    current = get_current_user()
    if current.role != 'admin' and current.id != user_id:
        return jsonify({'error': 'Non autorise'}), 403
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data and current.role == 'admin':
        user.role = data['role']
    if 'is_active' in data and current.role == 'admin':
        user.is_active = data['is_active']
    if 'password' in data:
        user.password_hash = bcrypt.hashpw(data['password'].encode(), bcrypt.gensalt()).decode()
    db.session.commit()
    return jsonify(user.to_dict())
