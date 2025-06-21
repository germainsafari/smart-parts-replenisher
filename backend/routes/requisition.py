from flask import Blueprint, request, jsonify
from services.requisition_service import create_requisition, list_requisitions
from datetime import datetime

bp = Blueprint('requisitions', __name__, url_prefix='/api/requisitions')

@bp.route('/', methods=['POST'], strict_slashes=False)
def submit():
    data = request.json
    part_id = data.get('part_id')
    quantity = data.get('quantity')
    needed_by_str = data.get('needed_by') # Expects YYYY-MM-DD string

    if not part_id or not quantity:
        return jsonify({'error': 'part_id and quantity are required'}), 400

    needed_by = None
    if needed_by_str:
        try:
            needed_by = datetime.strptime(needed_by_str, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format for needed_by. Use YYYY-MM-DD.'}), 400

    # In a real app, user_id would come from a session or JWT
    user_id = 1 
    
    result, status_code = create_requisition(
        user_id=user_id, 
        part_id=part_id, 
        qty_requested=quantity,
        needed_by=needed_by
    )
    return jsonify(result), status_code

@bp.route('/', methods=['GET'], strict_slashes=False)
def get_all():
    requisitions = list_requisitions()
    return jsonify(requisitions) 