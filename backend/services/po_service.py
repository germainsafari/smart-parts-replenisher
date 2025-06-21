# POService: draft/save POs, track statuses
from models import db, PurchaseOrder, Part
from datetime import date
from sqlalchemy.orm import joinedload

def create_po(part_id, qty, eta_str=None):
    part = Part.query.get(part_id)
    if not part:
        return {'error': f'Part with id {part_id} not found'}, 404

    eta = date.fromisoformat(eta_str) if eta_str else date.today()
    po = PurchaseOrder(part_id=part_id, qty_ordered=qty, eta=eta)
    db.session.add(po)
    db.session.commit()
    
    return {
        'po_id': po.po_id,
        'part_id': po.part_id,
        'part_sku': part.sku,
        'qty_ordered': po.qty_ordered,
        'status': po.status,
        'eta': po.eta.isoformat(),
        'created_at': po.created_at.isoformat()
    }, 201

def list_pos():
    purchase_orders = PurchaseOrder.query.options(joinedload(PurchaseOrder.part)).order_by(PurchaseOrder.created_at.desc()).all()
    return [{
        'po_id': po.po_id,
        'part_sku': po.part.sku,
        'qty_ordered': po.qty_ordered,
        'status': po.status,
        'eta': po.eta.isoformat() if po.eta else None,
    } for po in purchase_orders]

def update_po(po_id, status=None, eta=None):
    po = PurchaseOrder.query.get(po_id)
    if not po:
        return {'error': 'Purchase Order not found'}, 404
    
    if status:
        po.status = status
        # If order is delivered, update inventory
        if status.lower() == 'delivered':
            part = Part.query.get(po.part_id)
            if part:
                part.current_qty += po.qty_ordered

    if eta:
        po.eta = eta

    db.session.commit()
    return {
        'po_id': po.po_id,
        'status': po.status,
        'eta': po.eta.isoformat() if po.eta else None
    }, 200 