import React from "react";
import { Container, Row, Col, Alert, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Product from "../components/Product";

function WishlistPage({ onToast }) {
  const { user } = useAuth();
  const { wishlistItems } = useWishlist();

  if (!user) {
    return (
      <Container className="my-5 text-center" style={{ maxWidth: "550px" }}>
        <Card className="shadow-lg border-0 rounded-4 p-4 my-4">
          <div className="display-1 text-danger mb-3">
            <i className="fas fa-heart"></i>
          </div>
          <h3 className="fw-extrabold text-dark mb-2">Please Login to View Your Wishlist</h3>
          <p className="text-muted mb-4">
            Save your favorite products across devices and get notified on price drops by logging in.
          </p>
          <div className="d-grid gap-2">
            <Link to="/login" className="btn btn-primary btn-lg rounded-pill fw-bold">
              <i className="fas fa-right-to-bracket me-2"></i>Login / Register Now
            </Link>
            <Link to="/" className="btn btn-outline-secondary rounded-pill fw-bold mt-2">
              Explore Products
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1 className="fw-extrabold mb-4">
        <i className="fas fa-heart text-danger me-2"></i>My Wishlist ({wishlistItems.length})
      </h1>

      {wishlistItems.length === 0 ? (
        <Alert variant="info" className="p-4 rounded-4 shadow-sm text-center">
          <h4 className="fw-bold">Your Wishlist is Empty!</h4>
          <p className="text-muted">Explore our catalog and save items you love by tapping the heart icon.</p>
          <Link to="/" className="btn btn-primary px-4 rounded-pill fw-bold mt-2">
            Explore Catalog
          </Link>
        </Alert>
      ) : (
        <Row>
          {wishlistItems.map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="d-flex align-items-stretch mb-4">
              <Product product={product} onToast={onToast} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default WishlistPage;
