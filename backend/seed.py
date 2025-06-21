from app import app, db
from models import User, Part, Requisition, RequisitionItem, PurchaseOrder
from datetime import date, timedelta
import random

# This script should be run from the 'backend' directory
# with the virtual environment activated.
# Command: python seed.py

def seed_database():
    """Seeds the database with sample data for an engineering agency."""
    with app.app_context():
        if PurchaseOrder.query.first() is not None:
            print("Database appears to be already seeded. Skipping.")
            return

        print("Seeding database with sample data...")
        
        # --- Seed Users ---
        users = [User(id=1, username='j.doe'), User(id=2, username='m.smith')]
        db.session.add_all(users)

        # --- Seed Parts ---
        parts_data = [
            {'sku': 'MCU-ARD-UNO', 'name': 'Arduino Uno R3', 'min_level': 5, 'max_level': 20, 'current_qty': 15, 'price': 25.50},
            {'sku': 'SBC-RPI-4B', 'name': 'Raspberry Pi 4 Model B 4GB', 'min_level': 3, 'max_level': 10, 'current_qty': 5, 'price': 55.00},
            {'sku': 'MCU-ESP32-DEVK', 'name': 'ESP32 Development Kit', 'min_level': 10, 'max_level': 50, 'current_qty': 22, 'price': 12.75},
            {'sku': 'SEN-DHT22', 'name': 'DHT22 Temp/Humidity Sensor', 'min_level': 20, 'max_level': 100, 'current_qty': 45, 'price': 4.99},
            {'sku': 'SEN-HCSR04', 'name': 'HC-SR04 Ultrasonic Sensor', 'min_level': 15, 'max_level': 75, 'current_qty': 8, 'price': 1.99},
        ]
        parts = [Part(**data) for data in parts_data]
        db.session.add_all(parts)
        db.session.commit()

        # --- Seed Requisitions & POs ---
        for part in parts:
            if part.current_qty < part.min_level:
                po = PurchaseOrder(part_id=part.part_id, qty_ordered=(part.max_level - part.current_qty), unit_price=part.price, eta=date.today() + timedelta(days=14), status='pending')
                db.session.add(po)
        
        db.session.commit()
        print("Database seeded successfully.")

if __name__ == '__main__':
    seed_database() 