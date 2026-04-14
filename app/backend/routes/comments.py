from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Comment, Notification, Ticket

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('/ticket/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_comments(ticket_id):
    comments = Comment.query.filter_by(ticket_id=ticket_id).order_by(Comment.created_at).all()
    return jsonify([c.to_dict() for c in comments])

@comments_bp.route('/ticket/<int:ticket_id>', methods=['POST'])
@jwt_required()
def add_comment(ticket_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    comment = Comment(ticket_id=ticket_id, user_id=user_id, message=data['message'])
    db.session.add(comment)
    ticket = Ticket.query.get(ticket_id)
    if ticket and ticket.user_id != user_id:
        notif = Notification(
            user_id=ticket.user_id, ticket_id=ticket_id,
            message=f'Nouveau commentaire sur votre ticket #{ticket_id}'
        )
        db.session.add(notif)
    db.session.commit()
    return jsonify(comment.to_dict()), 201
