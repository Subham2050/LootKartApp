import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/formatCurrency";
import CheckoutModal from "../components/CheckoutModal";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } =
    useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <Container className="my-4">
      {/* Guest Banner Prompt */}
      {!isLoggedIn && (
        <Alert variant="warning" className="d-flex align-items-center justify-content-between rounded-4 shadow-sm mb-4">
          <div>
            <i className="fas fa-user-circle me-2 fs-5"></i>
            <strong>Browsing as Guest?</strong> Log in to sync your cart across devices and get exclusive member offers!
          </div>
          <Link to="/login" state={{ from: "/cart" }} className="btn btn-dark btn-sm rounded-pill px-3 fw-bold">
            Login Now
          </Link>
        </Alert>
      )}

      <Row className="g-4">
        <Col lg={8}>
          <h1 className="fw-extrabold mb-3">Shopping Cart ({totalItems})</h1>
          {cartItems.length === 0 ? (
            <Alert variant="info" className="p-4 rounded-4 shadow-sm text-center">
              <i className="fas fa-shopping-cart fs-1 text-info mb-3"></i>
              <h4 className="fw-bold">Your Cart is Empty!</h4>
              <p className="text-muted">Looks like you haven't added anything to your cart yet.</p>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <Link to="/" className="btn btn-primary px-4 rounded-pill fw-bold">
                  Start Shopping
                </Link>
                {!isLoggedIn && (
                  <Link to="/login" state={{ from: "/cart" }} className="btn btn-outline-secondary px-4 rounded-pill fw-bold">
                    Log In to View Saved Cart
                  </Link>
                )}
              </div>
            </Alert>
          ) : (
            <ListGroup variant="flush" className="shadow-sm rounded-4 border overflow-hidden">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id} className="p-3 border-bottom">
                  <Row className="align-items-center">
                    <Col md={2} xs={3}>
                      <div className="p-2 bg-white rounded border d-flex align-items-center justify-content-center" style={{ height: "80px" }}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fluid
                          style={{ maxHeight: "70px", objectFit: "contain" }}
                        />
                      </div>
                    </Col>
                    <Col md={4} xs={9}>
                      <Link
                        to={`/products/${item.id}`}
                        style={{ textDecoration: "none" }}
                        className="text-dark fw-bold"
                      >
                        {item.title}
                      </Link>
                      <div className="text-muted extra-small mt-1">In Stock</div>
                    </Col>
                    <Col md={2} xs={4} className="mt-2 mt-md-0 fw-extrabold text-primary fs-5">
                      {formatINR(item.price)}
                    </Col>
                    <Col md={2} xs={4} className="mt-2 mt-md-0">
                      <Form.Control
                        as="select"
                        size="sm"
                        value={item.qty}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        className="rounded-pill border-secondary"
                      >
                        {[...Array(item.countInStock || 10).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            Qty: {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2} xs={4} className="mt-2 mt-md-0 text-end">
                      <Button
                        type="button"
                        variant="light"
                        className="rounded-circle p-2"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <i className="fas fa-trash text-danger"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border rounded-4">
            <Card.Header className="bg-light fw-bold py-3">
              Order Summary ({totalItems} {totalItems === 1 ? "Item" : "Items"})
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-bold">{formatINR(totalPrice)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Charges:</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Taxes & GST:</span>
                  <span className="text-muted">Included</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fs-4 fw-extrabold text-dark">
                  <span>Total Amount:</span>
                  <span className="text-primary">{formatINR(totalPrice)}</span>
                </div>
              </ListGroup.Item>

              <ListGroup.Item className="p-3 bg-light">
                <div className="small fw-bold text-muted mb-2">
                  <i className="fas fa-percent me-1 text-warning"></i> Promo Offer
                </div>
                <div className="small text-success fw-semibold">
                  Use code <strong>LOOT10</strong> at checkout for 10% OFF!
                </div>
              </ListGroup.Item>

              <ListGroup.Item className="p-3">
                <Button
                  type="button"
                  size="lg"
                  variant="primary"
                  className="w-100 fw-extrabold rounded-pill py-3"
                  disabled={cartItems.length === 0}
                  onClick={() => setShowCheckout(true)}
                >
                  <i className="fas fa-shield-alt me-2"></i>Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Checkout Modal */}
      <CheckoutModal
        show={showCheckout}
        handleClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        clearCart={clearCart}
      />
    </Container>
  );
}

export default CartPage;
