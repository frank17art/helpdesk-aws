from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Ticket, Notification
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = int(get_jwt_identity())
    stats = {
        'total': Ticket.query.count(),
        'open': Ticket.query.filter_by(status='open').count(),
        'in_progress': Ticket.query.filter_by(status='in_progress').count(),
        'resolved': Ticket.query.filter_by(status='resolved').count(),
        'closed': Ticket.query.filter_by(status='closed').count(),
        'critical': Ticket.query.filter_by(priority='critical').count(),
        'unread_notifications': Notification.query.filter_by(
            user_id=user_id, is_read=False).count()
    }
    by_category = db.session.query(
        Ticket.category_id, func.count(Ticket.id)
    ).group_by(Ticket.category_id).all()
    stats['by_category'] = [{'category_id': r[0], 'count': r[1]} for r in by_category]
    return jsonify(stats)
