# Smart Parts Replenisher

## Overview
A web/mobile app to automate part requisitions, purchase-order (PO) creation, supplier notifications, and provide real-time inventory visibility.

### Key Benefits
- Order processing in seconds
- Eliminate human entry errors
- Proactive low-stock alerts
- 24/7 dashboard for inventory health

## Core Features
- Requisition Form
- Real-Time Stock Check
- Auto-PO Generation
- Supplier Notification
- Replenishment Dashboard
- Audit Trail & Reporting
- Role-Based Access Control

## Tech Stack
- **Backend:** Python + Flask
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Frontend:** React + Material-UI/Tailwind
- **Hosting:** Docker + Kubernetes
- **CI/CD:** GitHub Actions

## Getting Started
1. Clone the repo
2. Set up Python/Node.js environments
3. Configure PostgreSQL connection
4. Run backend and frontend servers

## Database
Postgres connection string:
```
postgresql://smartreplenishdb_owner:npg_r5jewgR8XGko@ep-shiny-bush-a2crag56-pooler.eu-central-1.aws.neon.tech/smartreplenishdb?sslmode=require
```

## Project Structure
- `backend/` - Flask API, business logic, DB models
- `frontend/` - React app, UI components
- `docker/` - Docker and deployment files 

## Running Locally

### Option 1: Using Docker Compose (Recommended)

1. Ensure Docker and Docker Compose are installed.
2. In the project root, run:
   ```sh
   cd docker
   docker-compose up --build
   ```
3. Access the frontend at [http://localhost:3000](http://localhost:3000)
   and the backend API at [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

### Option 2: Manual Setup

#### 1. Database
- Ensure PostgreSQL is running (use the provided connection string or your own local instance).
- Create the database and user if not using Docker Compose.

#### 2. Backend
```sh
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Set environment variable for DB if needed:
# export DATABASE_URL=postgresql://smartreplenishdb_owner:npg_r5jewgR8XGko@localhost:5432/smartreplenishdb
# Run migrations (if using Alembic):
# alembic upgrade head
python app.py
```

#### 3. Frontend
```sh
cd frontend
npm install
npm start
```

---

## Troubleshooting
- If ports 3000 or 5000 are in use, stop other services or change the ports in Docker Compose and the app configs.
- For database errors, check your connection string and ensure the database is running. 