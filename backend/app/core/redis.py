import redis
import fakeredis
import logging
from app.core.config import settings

logger = logging.getLogger("lootkart_redis")

def get_redis_client():
    try:
        r = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=0,
            decode_responses=True,
            socket_timeout=1.0
        )
        r.ping()
        logger.info(f"Connected to Live Redis server at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
        return r
    except Exception as e:
        logger.warning(f"Live Redis not available ({e}). Initializing In-Memory FakeRedis server for Idempotency...")
        return fakeredis.FakeRedis(decode_responses=True)

# Global Redis Client singleton instance
redis_db = get_redis_client()
