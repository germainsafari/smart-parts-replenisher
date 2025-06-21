from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

from database import db
from models import *
from routes.parts import bp as parts_bp
from routes.requisition import bp as requisitions_bp
from routes.po import bp as po_bp
from routes.reporting import bp as reporting_bp

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_recycle': 280, 'pool_pre_ping': True}
db.init_app(app)

# Register Blueprints
app.register_blueprint(parts_bp)
app.register_blueprint(requisitions_bp)
app.register_blueprint(po_bp)
app.register_blueprint(reporting_bp)

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    # When running directly, ensure tables are created.
    with app.app_context():
        db.create_all()
    app.run(debug=True) 