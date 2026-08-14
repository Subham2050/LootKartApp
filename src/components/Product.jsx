import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import { formatINR } from "../utils/formatCurrency";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "../Product.css";

function Product({ product, onToast }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const ratingValue = typeof product.rating === "object" ? product.rating?.rate : product.rating;
  const reviewCount = typeof product.rating === "object" ? product.rating?.count : (product.numReviews || 0);
  const title = product.title || product.name || "Product";
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    if (onToast) {
      onToast(`Added "${title.slice(0, 20)}..." to Cart!`, "success");
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (onToast) {
      onToast(
        isWishlisted
          ? `Removed from Wishlist`
          : `Added to Wishlist!`,
        isWishlisted ? "warning" : "danger"
      );
    }
  };

  return (
    <Card className="product-card h-100 shadow-sm">
      {/* Discount Badge */}
      <div className="badge-discount">
        <i className="fas fa-tag me-1"></i>25% OFF
      </div>

      {/* Wishlist Heart Button */}
      <button
        className="wishlist-toggle-btn"
        onClick={handleWishlistClick}
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <i className={isWishlisted ? "fas fa-heart text-danger" : "far fa-heart text-muted"}></i>
      </button>

      {/* Image Container */}
      <div className="card-image-container p-3 d-flex align-items-center justify-content-center bg-white">
        <Link to={`/products/${product.id}`}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={title}
            style={{ maxHeight: "180px", width: "auto", objectFit: "contain" }}
          />
        </Link>
      </div>

      {/* Body Content */}
      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <div className="text-uppercase text-muted extra-small fw-bold mb-1" style={{ fontSize: "0.72rem" }}>
            {product.category || "Electronics"}
          </div>
          <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
            <Card.Title as="div" className="product-title font-weight-bold text-dark mb-2">
              <strong>{title}</strong>
            </Card.Title>
          </Link>

          <div className="d-flex align-items-center mb-2">
            <Rating value={ratingValue || 0} text={`(${reviewCount})`} color="#f59e0b" />
          </div>
        </div>

        <div>
          <div className="d-flex align-items-baseline justify-content-between mt-2">
            <Card.Text as="h4" className="text-dark fw-extrabold mb-0">
              {formatINR(product.price)}
            </Card.Text>
            <span className="text-muted text-decoration-line-through small ms-2">
              {formatINR(product.price * 1.33)}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="w-100 mt-3 rounded-pill fw-bold"
            onClick={handleQuickAdd}
          >
            <i className="fas fa-cart-plus me-1"></i> Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;
