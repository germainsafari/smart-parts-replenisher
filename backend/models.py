from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

class Part(db.Model):
    __tablename__ = 'parts'
    part_id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.Text, nullable=False)
    min_level = db.Column(db.Integer, nullable=False)
    max_level = db.Column(db.Integer, nullable=False)
    current_qty = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False, server_default='0.0')

class Requisition(db.Model):
    __tablename__ = 'requisitions'
    req_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User')

class RequisitionItem(db.Model):
    __tablename__ = 'requisition_items'
    req_item_id = db.Column(db.Integer, primary_key=True)
    req_id = db.Column(db.Integer, db.ForeignKey('requisitions.req_id'))
    part_id = db.Column(db.Integer, db.ForeignKey('parts.part_id'))
    qty_requested = db.Column(db.Integer, nullable=False)
    needed_by = db.Column(db.Date, nullable=True)
    requisition = db.relationship('Requisition')
    part = db.relationship('Part')

class PurchaseOrder(db.Model):
    __tablename__ = 'purchase_orders'
    po_id = db.Column(db.Integer, primary_key=True)
    part_id = db.Column(db.Integer, db.ForeignKey('parts.part_id'))
    qty_ordered = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    eta = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    part = db.relationship('Part') 