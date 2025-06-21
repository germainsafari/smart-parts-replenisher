from flask import Blueprint, request, jsonify
from models import db, Part

bp = Blueprint('parts', __name__, url_prefix='/api/parts')

@bp.route('/', methods=['GET'], strict_slashes=False)
def list_parts():
    parts = Part.query.all()
    return jsonify([{'part_id': p.part_id, 'sku': p.sku, 'name': p.name, 'current_qty': p.current_qty, 'min_level': p.min_level, 'max_level': p.max_level, 'price': p.price} for p in parts])

@bp.route('/', methods=['POST'], strict_slashes=False)
def create_part():
    data = request.json
    part = Part(sku=data['sku'], name=data['name'], min_level=data['min_level'], max_level=data['max_level'], current_qty=data['current_qty'])
    db.session.add(part)
    db.session.commit()
    return jsonify({'part_id': part.part_id}), 201

@bp.route('/<int:part_id>', methods=['GET'])
def get_part(part_id):
    part = Part.query.get_or_404(part_id)
    return jsonify({'part_id': part.part_id, 'sku': part.sku, 'name': part.name, 'current_qty': part.current_qty, 'min_level': part.min_level, 'max_level': part.max_level})

@bp.route('/<int:part_id>', methods=['PUT'])
def update_part(part_id):
    part = Part.query.get_or_404(part_id)
    data = request.json
    for field in ['sku', 'name', 'min_level', 'max_level', 'current_qty']:
        if field in data:
            setattr(part, field, data[field])
    db.session.commit()
    return jsonify({'message': 'updated'})

@bp.route('/<int:part_id>', methods=['DELETE'])
def delete_part(part_id):
    part = Part.query.get_or_404(part_id)
    db.session.delete(part)
    db.session.commit()
    return jsonify({'message': 'deleted'}) 