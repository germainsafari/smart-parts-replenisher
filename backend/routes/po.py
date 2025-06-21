from flask import Blueprint, request, jsonify
from services.po_service import create_po, list_pos, update_po
from models import db, PurchaseOrder
from datetime import datetime

bp = Blueprint('po', __name__, url_prefix='/api/purchase-orders')

@bp.route('/', methods=['GET'], strict_slashes=False)
def list_all_pos():
    pos = list_pos()
    return jsonify(pos)

@bp.route('/', methods=['POST'], strict_slashes=False)
def create_new_po():
    data = request.json
    part_id = data.get('part_id')
    quantity = data.get('quantity')

    if not part_id or not quantity:
        return jsonify({'error': 'part_id and quantity are required'}), 400

    result, status_code = create_po(part_id=part_id, qty=quantity)
    return jsonify(result), status_code

@bp.route('/<int:po_id>', methods=['PUT'], strict_slashes=False)
def update_po_status(po_id):
    data = request.json
    status = data.get('status')
    eta_str = data.get('eta')

    eta = None
    if eta_str:
        try:
            # Assuming eta_str is in 'YYYY-MM-DD' format from the frontend
            eta = datetime.strptime(eta_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            # Pass on invalid strings to be handled by service or DB
            pass

    result, status_code = update_po(po_id, status=status, eta=eta)
    return jsonify(result), status_code 