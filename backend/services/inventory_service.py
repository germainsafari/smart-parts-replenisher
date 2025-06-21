# InventoryService: current stock, reorder thresholds
from models import Part

def check_stock(part_id):
    part = Part.query.get(part_id)
    if not part:
        return None
    return {
        'part_id': part.part_id,
        'sku': part.sku,
        'name': part.name,
        'current_qty': part.current_qty,
        'min_level': part.min_level,
        'max_level': part.max_level
    }

def needs_reorder(part):
    return part.current_qty < part.min_level 