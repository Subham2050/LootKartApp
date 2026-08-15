import json
from fastapi import Request
from app.core.redis import redis_db

IDEMPOTENCY_TTL_SECONDS = 86400 # 24 hours

def get_idempotency_key(request: Request) -> str:
    return request.headers.get("Idempotency-Key") or request.headers.get("x-idempotency-key")

def check_idempotency(key: str):
    if not key:
        return None
    
    redis_key = f"idempotency:{key}"
    cached_data = redis_db.get(redis_key)
    if cached_data:
        try:
            return json.loads(cached_data)
        except Exception:
            return None
    return None

def save_idempotency(key: str, data: dict):
    if not key:
        return
    redis_key = f"idempotency:{key}"
    try:
        redis_db.setex(redis_key, IDEMPOTENCY_TTL_SECONDS, json.dumps(data))
    except Exception as e:
        print(f"Failed to save idempotency key to Redis: {e}")
