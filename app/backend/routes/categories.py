from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Category

categories_bp = Blueprint('categories', __name__)

@categories_bp.route('', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])

@categories_bp.route('', methods=['POST'])
@jwt_required()
def create_category():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'error': 'Non autorise'}), 403
    data = request.get_json()
    cat = Category(name=data['name'], icon=data.get('icon'), color=data.get('color'))
    db.session.add(cat)
    db.session.commit()
    return jsonify(cat.to_dict()), 201
