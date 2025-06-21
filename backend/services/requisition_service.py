# Handles requisition form submissions and validations
from models import db, Requisition, RequisitionItem, Part, User, PurchaseOrder
from flask import request, jsonify
from sqlalchemy.orm import joinedload
from datetime import date, timedelta

def submit_requisition(user_id, items):
    req = Requisition(user_id=user_id)
    db.session.add(req)
    db.session.flush()  # get req_id
    for item in items:
        part = Part.query.get(item['part_id'])
        if not part or part.current_qty < item['qty_requested']:
            return {'error': f'Insufficient stock for part {item["part_id"]}'}, 400
        req_item = RequisitionItem(req_id=req.req_id, part_id=part.part_id, qty_requested=item['qty_requested'])
        db.session.add(req_item)
        part.current_qty -= item['qty_requested']
    db.session.commit()
    return {'message': 'Requisition submitted', 'req_id': req.req_id}, 201 

def create_requisition(user_id, part_id, qty_requested, needed_by=None):
    part = Part.query.get(part_id)
    if not part:
        return {'error': f'Part with id {part_id} not found'}, 404
    if part.current_qty < qty_requested:
        return {'error': f'Insufficient stock for part {part.name}'}, 400

    user = User.query.get(user_id)
    if not user:
        user = User(id=user_id, username=f'user{user_id}')
        db.session.add(user)

    req = Requisition(user_id=user_id)
    db.session.add(req)
    db.session.flush()

    req_item = RequisitionItem(
        req_id=req.req_id,
        part_id=part.part_id,
        qty_requested=qty_requested,
        needed_by=needed_by
    )
    db.session.add(req_item)
    part.current_qty -= qty_requested
    db.session.commit()
    
    return {
        'req_item_id': req_item.req_item_id,
        'req_id': req.req_id,
        'part_id': part.part_id,
        'part_name': part.name,
        'qty_requested': req_item.qty_requested,
        'needed_by': req_item.needed_by.isoformat() if req_item.needed_by else None,
        'created_at': req.created_at.isoformat()
    }, 201

def list_requisitions():
    requisitions = RequisitionItem.query.options(
        joinedload(RequisitionItem.requisition).joinedload(Requisition.user),
        joinedload(RequisitionItem.part)
    ).order_by(RequisitionItem.req_item_id.desc()).all()
    
    return [{
        'req_item_id': item.req_item_id,
        'req_id': item.req_id,
        'part_sku': item.part.sku,
        'part_name': item.part.name,
        'qty_requested': item.qty_requested,
        'needed_by': item.needed_by.isoformat() if item.needed_by else None,
        'username': item.requisition.user.username if item.requisition.user else 'N/A',
        'created_at': item.requisition.created_at.isoformat()
    } for item in requisitions] 