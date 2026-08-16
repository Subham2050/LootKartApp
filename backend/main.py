import sys
import os
import time
import datetime
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.core.config import settings
from app.core.logging import logger
from app.core.redis import redis_db
from app.seed import seed_database

# Routers
from app.routers import auth, products, orders, reviews

# Initialize DB tables & seed data
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise FastAPI Backend Microservice with SQLite DB, JWT Auth, and Redis Idempotency",
    version=settings.VERSION
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Latency & Performance Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
    logger.info(f"{request.method} {request.url.path} - Status: {response.status_code} - Latency: {process_time:.2f}ms")
    return response

# Global Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "code": exc.status_code, "message": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"status": "error", "code": 422, "message": "Validation Error", "details": exc.errors()},
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"status": "error", "code": 500, "message": "Internal Server Error. Please try again later."},
    )

# Health & Readiness Probes
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/ready", tags=["Health"])
@app.get("/api/ready", tags=["Health"])
def readiness_probe():
    db_healthy = False
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        db_healthy = True
    except Exception as e:
        logger.error(f"Database readiness check failed: {e}")

    redis_healthy = False
    try:
        redis_healthy = redis_db.ping()
    except Exception as e:
        logger.error(f"Redis readiness check failed: {e}")

    is_ready = db_healthy and redis_healthy

    return {
        "status": "ready" if is_ready else "degraded",
        "database": "healthy" if db_healthy else "unhealthy",
        "redis": "healthy" if redis_healthy else "unhealthy",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

# Include APIRouters under /api prefix
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(products.router, prefix=settings.API_PREFIX)
app.include_router(orders.router, prefix=settings.API_PREFIX)
app.include_router(reviews.router, prefix=settings.API_PREFIX)
