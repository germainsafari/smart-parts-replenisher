# ---- Builder Stage ----
# This stage installs python dependencies
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends build-essential

# Copy only requirements to leverage Docker cache
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /app/wheels -r requirements.txt


# ---- Final Stage ----
# This stage builds the final, lean image
FROM python:3.11-slim

# Create a non-root user
RUN useradd -m appuser
WORKDIR /home/appuser

# Copy installed dependencies from builder stage
COPY --from=builder /app/wheels /wheels
COPY --from=builder /app/requirements.txt .
RUN pip install --no-cache /wheels/*

# Copy application code
COPY . .

# Set ownership and switch to non-root user
RUN chown -R appuser:appuser /home/appuser
USER appuser

# Expose port and run the application with Gunicorn
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"] 