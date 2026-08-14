import React from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import Product from "../components/Product";

function WishlistPage({ onToast }) {
  const { wishlistItems } = useWishlist();

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
