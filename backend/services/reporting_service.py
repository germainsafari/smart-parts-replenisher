# ReportingService: generate audit logs & analytics (stub)
def log_event(event_type, details):
    # TODO: Implement audit logging
    print(f'Event: {event_type} | Details: {details}')

from models import db, Part, PurchaseOrder, RequisitionItem
from sqlalchemy import func, extract

def get_inventory_report():
    parts = Part.query.order_by(Part.sku).all()
    return [{
        'sku': p.sku,
        'name': p.name,
        'current_qty': p.current_qty,
        'min_level': p.min_level,
        'status': 'Low Stock' if p.current_qty < p.min_level else 'OK'
    } for p in parts]

def get_spend_report():
    spend_data = db.session.query(
        extract('year', PurchaseOrder.created_at).label('year'),
        extract('month', PurchaseOrder.created_at).label('month'),
        func.sum(PurchaseOrder.qty_ordered * PurchaseOrder.unit_price).label('total_spend')
    ).group_by('year', 'month').order_by('year', 'month').all()

    return [{
        'month': f"{int(s.year)}-{int(s.month):02d}",
        'total_spend': float(s.total_spend)
    } for s in spend_data]

def get_part_velocity_report():
    velocity_data = db.session.query(
        Part.sku,
        Part.name,
        func.count(RequisitionItem.req_item_id).label('request_count'),
        func.sum(RequisitionItem.qty_requested).label('total_requested')
    ).join(Part).group_by(Part.part_id).order_by(func.count(RequisitionItem.req_item_id).desc()).all()

    return [{
        'sku': v.sku,
        'name': v.name,
        'request_count': v.request_count,
        'total_requested': int(v.total_requested) if v.total_requested else 0
    } for v in velocity_data]

def get_dashboard_kpis():
    """
    Computes the main KPIs for the dashboard.
    """
    # 1. Part-related KPIs
    parts = Part.query.all()
    total_stock_value = sum(p.current_qty * p.price for p in parts)
    low_stock_count = sum(1 for p in parts if p.current_qty > 0 and p.current_qty < p.min_level)
    out_of_stock_count = sum(1 for p in parts if p.current_qty == 0)
    low_stock_parts = [{ 'part_id': p.part_id, 'name': p.name, 'sku': p.sku } for p in parts if p.current_qty > 0 and p.current_qty < p.min_level]

    # 2. Pending Orders KPI
    pending_orders_count = PurchaseOrder.query.filter(PurchaseOrder.status == 'pending').count()

    # 3. Recent part usage for chart
    part_usage_data = db.session.query(
        Part.name,
        func.sum(RequisitionItem.qty_requested).label('total_requested')
    ).join(Part).group_by(Part.part_id).order_by(func.sum(RequisitionItem.qty_requested).desc()).limit(10).all()

    inventory_data = [{'name': p.name, 'value': p.current_qty} for p in parts]


    return {
        'total_stock_value': round(total_stock_value, 2),
        'low_stock_count': low_stock_count,
        'out_of_stock_count': out_of_stock_count,
        'pending_orders_count': pending_orders_count,
        'low_stock_parts': low_stock_parts, # For alerts
        'inventory_data': inventory_data
    } 