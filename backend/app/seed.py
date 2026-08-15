import os
import json
import re
from sqlalchemy import text
from app.core.database import engine, SessionLocal, Base
from app.models.product import ProductModel
from app.models.user import UserModel
from app.core.security import hash_password

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
JSON_PATH = os.path.join(BASE_DIR, "flipkart_fashion_products_dataset.json")

def normalize_category(sub_cat, cat, title):
    combined = f"{sub_cat} {cat} {title}".lower()
    
    if any(k in combined for k in ["winter", "sweater", "jacket", "hoodie", "coat", "cardigan", "poncho"]):
        return "Winter Wear"
    if any(k in combined for k in ["shoe", "sneaker", "sandal", "boot", "slipper", "footwear"]):
        return "Footwear"
    if any(k in combined for k in ["topwear", "t-shirt", "shirt", "polo", "tshirt"]):
        return "Topwear"
    if any(k in combined for k in ["bottomwear", "track", "pant", "jeans", "short", "trouser", "pyjama"]):
        return "Bottomwear"
    if any(k in combined for k in ["bag", "wallet", "belt", "backpack", "handbag"]):
        return "Bags & Belts"
    if any(k in combined for k in ["ethnic", "kurta", "saree", "lehenga", "dhoti", "sherwani"]):
        return "Ethnic Wear"
    if any(k in combined for k in ["sock", "innerwear", "brief", "trunk", "swimwear"]):
        return "Innerwear & Socks"
    if any(k in combined for k in ["tie", "cufflink", "accessory", "accessories", "goggles", "watch", "jewel"]):
        return "Accessories"
    
    clean_sub = re.sub(r"^(.*?)\s*(Clothing and Accessories|Bags, Wallets & Belts)$", r"\1", sub_cat, flags=re.IGNORECASE).strip()
    return clean_sub.title() if clean_sub else "Fashion"

def parse_flipkart_products():
    if not os.path.exists(JSON_PATH):
        print(f"Warning: Flipkart JSON dataset not found at {JSON_PATH}")
        return []

    try:
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading Flipkart dataset: {e}")
        return []

    parsed = []
    seen_keys = set()

    for item in data:
        title = item.get("title", "").strip()
        images = item.get("images", [])
        selling_price_str = str(item.get("selling_price", "")).replace(",", "").strip()
        
        if not title or not images or not selling_price_str:
            continue

        try:
            price = float(re.sub(r"[^\d.]", "", selling_price_str))
            if price <= 0:
                continue
        except Exception:
            continue

        rating_str = str(item.get("average_rating", "4.0")).strip()
        try:
            rating = float(rating_str) if rating_str else 4.0
        except Exception:
            rating = 4.0

        raw_img = images[0]
        # Transform 128x128 thumbnail URLs into 500x500 high-res image URLs
        high_res_img = raw_img.replace("/128/128/", "/500/500/").replace("/100/100/", "/500/500/")

        unique_key = (title, high_res_img)
        if unique_key in seen_keys:
            continue
        seen_keys.add(unique_key)

        sub_cat = item.get("sub_category", "")
        cat = item.get("category", "")
        normalized_cat = normalize_category(sub_cat, cat, title)

        idx = len(parsed) + 1
        parsed.append({
            "id": idx,
            "title": title,
            "price": price,
            "description": item.get("description", title) or title,
            "category": normalized_cat,
            "image": high_res_img,
            "rating_rate": rating,
            "rating_count": 50 + (idx % 450),
            "stock_count": 15 + (idx % 35)
        })

    return parsed

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Parsing Flipkart JSON dataset...")
        flipkart_items = parse_flipkart_products()

        if flipkart_items:
            print(f"Total valid products parsed: {len(flipkart_items)}. Clearing existing products...")
            db.query(ProductModel).delete()
            db.commit()

            print("Bulk inserting products into SQLite database in chunks...")
            chunk_size = 2000
            for i in range(0, len(flipkart_items), chunk_size):
                chunk = flipkart_items[i:i + chunk_size]
                db.bulk_insert_mappings(ProductModel, chunk)
                db.commit()
                print(f"  Inserted chunk {i // chunk_size + 1} ({len(chunk)} items)...")

            print(f"Successfully seeded ALL {len(flipkart_items)} products into SQLite database!")

        if db.query(UserModel).filter(UserModel.email == "demo@lootkart.com").first() is None:
            demo_user = UserModel(
                name="Subham Kumar",
                email="demo@lootkart.com",
                hashed_password=hash_password("lootkart123"),
                is_admin=True
            )
            db.add(demo_user)
            db.commit()
            print("Successfully seeded demo user (demo@lootkart.com / lootkart123)!")

    except Exception as e:
        print(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
