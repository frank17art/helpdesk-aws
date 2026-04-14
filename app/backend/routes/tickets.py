from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Ticket, ActivityLog, Notification, User
from datetime import datetime

tickets_bp = Blueprint('tickets', __name__)

def get_current_user():
    user_id = int(get_jwt_identity())
    return User.query.get(user_id)

@tickets_bp.route('', methods=['GET'])
@jwt_required()
def get_tickets():
    user = get_current_user()
    if user.role in ['admin', 'tech']:
        tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
    else:
        tickets = Ticket.query.filter_by(user_id=user.id).order_by(Ticket.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tickets])

@tickets_bp.route('', methods=['POST'])
@jwt_required()
def create_ticket():
    user = get_current_user()
    data = request.get_json()
    ticket = Ticket(
        title=data['title'],
        description=data.get('description'),
        priority=data.get('priority', 'medium'),
        category_id=data.get('category_id'),
        user_id=user.id
    )
    db.session.add(ticket)
    db.session.flush()
    log = ActivityLog(ticket_id=ticket.id, user_id=user.id, action='created', new_value='open')
    db.session.add(log)
    db.session.commit()
    return jsonify(ticket.to_dict()), 201

@tickets_bp.route('/<int:ticket_id>', methods=['GET'])
@jwt_required()
def get_ticket(ticket_id):
    ticket = Ticket.query.get_or_404(ticket_id)
    return jsonify(ticket.to_dict())

@tickets_bp.route('/<int:ticket_id>', methods=['PATCH'])
@jwt_required()
def update_ticket(ticket_id):
    user = get_current_user()
    ticket = Ticket.query.get_or_404(ticket_id)
    data = request.get_json()
    for field in ['title', 'description', 'priority', 'category_id']:
        if field in data:
            old_val = str(getattr(ticket, field))
            setattr(ticket, field, data[field])
            log = ActivityLog(ticket_id=ticket.id, user_id=user.id,
                              action=f'updated_{field}', old_value=old_val, new_value=str(data[field]))
            db.session.add(log)
    if 'status' in data:
        old_status = ticket.status
        ticket.status = data['status']
        if data['status'] == 'resolved':
            ticket.resolved_at = datetime.utcnow()
        log = ActivityLog(ticket_id=ticket.id, user_id=user.id,
                          action='status_changed', old_value=old_status, new_value=data['status'])
        db.session.add(log)
        if ticket.user_id:
            notif = Notification(
                user_id=ticket.user_id, ticket_id=ticket.id,
                message=f'Votre ticket #{ticket.id} est maintenant {data["status"]}'
            )
            db.session.add(notif)
    if 'assigned_to' in data and user.role in ['admin', 'tech']:
        ticket.assigned_to = data['assigned_to']
    db.session.commit()
    return jsonify(ticket.to_dict())

@tickets_bp.route('/<int:ticket_id>', methods=['DELETE'])
@jwt_required()
def delete_ticket(ticket_id):
    user = get_current_user()
    if user.role != 'admin':
        return jsonify({'error': 'Non autorise'}), 403
    ticket = Ticket.query.get_or_404(ticket_id)
    db.session.delete(ticket)
    db.session.commit()
    return jsonify({'message': 'Ticket supprime'})
