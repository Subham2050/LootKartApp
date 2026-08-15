import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Container,
  ListGroup,
  Button,
  Form,
  Spinner,
  Alert,
  Card,
  Badge,
  ProgressBar,
  Modal,
} from "react-bootstrap";
import Rating from "../components/Rating";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatINR } from "../utils/formatCurrency";
import CheckoutModal from "../components/CheckoutModal";

function ProductPage({ onToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, totalPrice, clearCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  // Review Modal & List State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "" });
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely outstanding quality! Exceeded my expectations. Fast delivery too.",
    },
    {
      id: 2,
      name: "Priya Patel",
      rating: 4,
      date: "1 week ago",
      comment: "Very good product for the price. Packaging was solid.",
    },
  ]);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch from FastAPI backend
        try {
          const res = await api.get(`/products/${id}`);
          if (isMounted) {
            setProduct(res.data);
          }
        } catch (backendErr) {
          console.warn("Backend product endpoint unavailable, using FakeStore fallback", backendErr);
          const fallbackRes = await axios.get(`https://fakestoreapi.com/products/${id}`);
          if (isMounted) {
            setProduct(fallbackRes.data);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load product details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const title = product?.title || product?.name || "Product Details";
  const ratingRate = product?.rating?.rate ?? product?.rating_rate ?? product?.rating;
  const ratingCount = product?.rating?.count ?? product?.rating_count ?? product?.numReviews ?? 120;
  const stockCount = product?.stock_count ?? product?.countInStock ?? 10;
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      if (onToast) {
        onToast(`Added "${title.slice(0, 20)}..." to Cart!`, "success");
      }
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, qty);
      setShowCheckout(true);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      const success = toggleWishlist(product);
      if (onToast) {
        if (!success) {
          onToast("Please login to save items to your wishlist!", "info");
        } else {
          onToast(
            isWishlisted ? "Removed from Wishlist" : "Added to Wishlist!",
            isWishlisted ? "warning" : "danger"
          );
        }
      }
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment || !newReview.name) return;

    const added = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating),
      date: "Just now",
      comment: newReview.comment,
    };

    setReviewsList([added, ...reviewsList]);
    setShowReviewModal(false);
    setNewReview({ rating: 5, comment: "", name: "" });

    if (onToast) {
      onToast("Thank you for your review!", "success");
    }
  };

  return (
    <Container className="my-4">
      <Link to="/" className="btn btn-outline-secondary rounded-pill mb-4 font-weight-bold">
        <i className="fas fa-arrow-left me-2"></i>Back to Catalog
      </Link>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading product...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-4 shadow-sm">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      ) : !product ? (
        <Alert variant="warning">Product not found.</Alert>
      ) : (
        <>
          <Row className="g-4">
            <Col md={6}>
              <div
                className="d-flex align-items-center justify-content-center p-4 bg-white rounded-4 shadow-sm border position-relative"
                style={{ height: "480px" }}
              >
                <button
                  className="wishlist-toggle-btn"
                  onClick={handleWishlistToggle}
                  style={{ top: "15px", right: "15px", width: "42px", height: "42px" }}
                >
                  <i className={isWishlisted ? "fas fa-heart text-danger fs-5" : "far fa-heart text-muted fs-5"}></i>
                </button>
                <Image
                  src={product.image}
                  alt={title}
                  fluid
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Col>

            <Col md={6}>
              <div className="p-2">
                <Badge bg="primary" className="mb-2 px-3 py-2 text-uppercase">
                  {product.category || "Fashion"}
                </Badge>

                <h2 className="fw-extrabold text-dark mb-2">{title}</h2>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <Rating value={ratingRate || 4.5} text={`(${ratingCount} verified reviews)`} color="#f59e0b" />
                </div>

                <div className="d-flex align-items-baseline gap-3 my-3">
                  <span className="display-6 fw-extrabold text-dark">
                    {formatINR(product.price)}
                  </span>
                  <span className="fs-5 text-muted text-decoration-line-through">
                    {formatINR(product.price * 1.33)}
                  </span>
                  <Badge bg="success" className="fs-6 px-2 py-1">25% OFF</Badge>
                </div>

                <p className="text-muted mb-4 leading-relaxed">{product.description}</p>

                {/* Purchase Panel */}
                <Card className="shadow-sm border rounded-4 p-3 mb-4">
                  <Row className="align-items-center mb-3">
                    <Col xs={6}>
                      <span className="text-muted">Availability:</span>
                    </Col>
                    <Col xs={6} className="text-end">
                      <span className={stockCount > 0 ? "text-success fw-bold" : "text-danger fw-bold"}>
                        <i className="fas fa-circle-check me-1"></i>In Stock (Ready to Ship)
                      </span>
                    </Col>
                  </Row>

                  {stockCount > 0 && (
                    <Row className="align-items-center mb-3">
                      <Col xs={6}>
                        <span className="fw-semibold">Select Quantity:</span>
                      </Col>
                      <Col xs={6}>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          className="rounded-pill border-secondary"
                        >
                          {[...Array(stockCount).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1} {x === 0 ? "Unit" : "Units"}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  )}

                  <div className="d-grid gap-2 d-md-flex">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      className="w-100 fw-bold rounded-pill"
                      onClick={handleAddToCart}
                    >
                      <i className="fas fa-shopping-cart me-2"></i>Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 fw-bold rounded-pill"
                      onClick={handleBuyNow}
                    >
                      <i className="fas fa-bolt me-2"></i>Buy Now
                    </Button>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>

          {/* Customer Reviews Section */}
          <Row className="mt-5 pt-4 border-top">
            <Col lg={4} className="mb-4">
              <Card className="shadow-sm border rounded-4 p-3">
                <h5 className="fw-bold mb-3">Customer Reviews</h5>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="display-4 fw-extrabold text-dark">{ratingRate || 4.5}</div>
                  <div>
                    <Rating value={ratingRate || 4.5} text="" color="#f59e0b" />
                    <div className="small text-muted mt-1">Based on {ratingCount || 120} reviews</div>
                  </div>
                </div>

                {/* Rating Distribution Progress Bars */}
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-2 small mb-1">
                    <span>5★</span>
                    <ProgressBar now={75} variant="warning" className="flex-grow-1" style={{ height: "6px" }} />
                    <span className="text-muted">75%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small mb-1">
                    <span>4★</span>
                    <ProgressBar now={18} variant="warning" className="flex-grow-1" style={{ height: "6px" }} />
                    <span className="text-muted">18%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small mb-1">
                    <span>3★</span>
                    <ProgressBar now={5} variant="warning" className="flex-grow-1" style={{ height: "6px" }} />
                    <span className="text-muted">5%</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-100 rounded-pill fw-bold"
                  onClick={() => setShowReviewModal(true)}
                >
                  <i className="fas fa-pen me-2"></i>Write a Review
                </Button>
              </Card>
            </Col>

            <Col lg={8}>
              <h5 className="fw-bold mb-3">Verified Buyer Reviews ({reviewsList.length})</h5>
              <div className="d-flex flex-column gap-3">
                {reviewsList.map((rev) => (
                  <Card key={rev.id} className="shadow-sm border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="fw-bold">
                        {rev.name} <Badge bg="success" className="ms-2 extra-small">Verified Buyer</Badge>
                      </div>
                      <span className="text-muted extra-small">{rev.date}</span>
                    </div>
                    <Rating value={rev.rating} text="" color="#f59e0b" />
                    <p className="text-muted mt-2 mb-0">{rev.comment}</p>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>

          {/* Write Review Modal */}
          <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Write a Customer Review</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleReviewSubmit}>
              <Modal.Body className="p-4">
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Your Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Subham Kumar"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Rating *</Form.Label>
                  <Form.Select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Good</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Below Average</option>
                    <option value={1}>1 Star - Poor</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Review Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    placeholder="Share your experience with this product..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="fw-bold">
                  Submit Review
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          {/* Checkout Modal Trigger */}
          <CheckoutModal
            show={showCheckout}
            handleClose={() => setShowCheckout(false)}
            cartItems={cartItems}
            totalPrice={totalPrice}
            clearCart={clearCart}
          />
        </>
      )}
    </Container>
  );
}

export default ProductPage;
