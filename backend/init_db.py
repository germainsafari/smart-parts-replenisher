from app import app, db

# This script should be run from the 'backend' directory
# with the virtual environment activated.
# Command: python init_db.py

with app.app_context():
    print("Initializing the database...")
    # Drop all tables to ensure a clean slate, then recreate them.
    db.drop_all()
    db.create_all()
    print("Database initialized successfully.") 