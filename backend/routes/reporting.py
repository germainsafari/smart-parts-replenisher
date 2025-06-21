from flask import Blueprint, jsonify
from services.reporting_service import get_inventory_report, get_spend_report, get_part_velocity_report, get_dashboard_kpis

bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@bp.route('/kpis', methods=['GET'], strict_slashes=False)
def dashboard_kpis():
    kpis = get_dashboard_kpis()
    return jsonify(kpis)

@bp.route('/inventory', methods=['GET'], strict_slashes=False)
def inventory_report():
    report_data = get_inventory_report()
    return jsonify(report_data)

@bp.route('/spend', methods=['GET'], strict_slashes=False)
def spend_report():
    report_data = get_spend_report()
    return jsonify(report_data)

@bp.route('/velocity', methods=['GET'], strict_slashes=False)
def velocity_report():
    report_data = get_part_velocity_report()
    return jsonify(report_data) 