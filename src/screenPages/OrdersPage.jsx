import React from "react";
import { Container, Row, Col, Card, Badge, Alert, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/formatCurrency";

function OrdersPage() {
  const { user } = useAuth();
  const { orders } = useOrders();

  const getStepClass = (currentStep, targetStep) => {
    if (currentStep > targetStep) return "completed";
    if (currentStep === targetStep) return "active";
    return "";
  };

  // If user is not logged in, prompt login
  if (!user) {
    return (
      <Container className="my-5 text-center" style={{ maxWidth: "550px" }}>
        <Card className="shadow-lg border-0 rounded-4 p-4 my-4">
          <div className="display-1 text-primary mb-3">
            <i className="fas fa-lock"></i>
          </div>
          <h3 className="fw-extrabold text-dark mb-2">Please Login to View Your Orders</h3>
          <p className="text-muted mb-4">
            Your order history, tracking details, and receipts are securely linked to your account.
          </p>
          <div className="d-grid gap-2">
            <Link to="/login" className="btn btn-primary btn-lg rounded-pill fw-bold">
              <i className="fas fa-right-to-bracket me-2"></i>Login / Register Now
            </Link>
            <Link to="/" className="btn btn-outline-secondary rounded-pill fw-bold mt-2">
              Continue Browsing Products
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h1 className="fw-extrabold mb-4">
        <i className="fas fa-box-open text-primary me-2"></i>My Orders ({orders.length})
      </h1>

      {orders.length === 0 ? (
        <Alert variant="info" className="p-4 rounded-4 shadow-sm text-center">
          <i className="fas fa-box fs-1 text-info mb-3"></i>
          <h4 className="fw-bold">No Orders Placed Yet!</h4>
          <p className="text-muted">You haven't placed any orders on LootKart yet.</p>
          <Link to="/" className="btn btn-primary px-4 rounded-pill fw-bold mt-2">
            Start Shopping
          </Link>
        </Alert>
      ) : (
        <Row className="g-4">
          {orders.map((order) => (
            <Col key={order.id} xs={12}>
              <Card className="shadow-sm border rounded-4 overflow-hidden">
                <Card.Header className="bg-light d-flex flex-wrap align-items-center justify-content-between py-3">
                  <div>
                    <span className="text-muted small">ORDER ID:</span>{" "}
                    <strong className="text-dark me-3">#{order.id}</strong>
                    <span className="text-muted small me-3">
                      PLACED ON: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div>
                    <Badge bg="success" className="px-3 py-2 fs-6">
                      <i className="fas fa-truck-fast me-1"></i> {order.status}
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  {/* Delivery Stepper Bar */}
                  <div className="my-3 p-3 bg-light rounded-4">
                    <div className="d-flex justify-content-between position-relative">
                      <div className={`stepper-item ${getStepClass(order.step, 1)}`}>
                        <div className="stepper-circle">1</div>
                        <div className="small fw-bold mt-2">Order Placed</div>
                      </div>
                      <div className={`stepper-item ${getStepClass(order.step, 2)}`}>
                        <div className="stepper-circle">2</div>
                        <div className="small fw-bold mt-2">In Transit</div>
                      </div>
                      <div className={`stepper-item ${getStepClass(order.step, 3)}`}>
                        <div className="stepper-circle">3</div>
                        <div className="small fw-bold mt-2">Out for Delivery</div>
                      </div>
                      <div className={`stepper-item ${getStepClass(order.step, 4)}`}>
                        <div className="stepper-circle">4</div>
                        <div className="small fw-bold mt-2">Delivered</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Line Items */}
                  <Row className="align-items-center g-3 my-3">
                    <Col md={8}>
                      <h6 className="fw-bold mb-3">Items in this Order:</h6>
                      <div className="d-flex flex-wrap gap-3">
                        {order.items && order.items.map((item) => (
                          <div key={item.id} className="d-flex align-items-center gap-2 p-2 border rounded bg-white" style={{ maxWidth: "280px" }}>
                            <Image src={item.image} alt={item.title} style={{ width: "45px", height: "45px", objectFit: "contain" }} />
                            <div>
                              <div className="small fw-bold text-truncate" style={{ maxWidth: "180px" }}>{item.title}</div>
                              <div className="extra-small text-muted">Qty: {item.qty} | {formatINR(item.price)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col md={4} className="border-start-md pt-3 pt-md-0">
                      <div className="p-2 bg-light rounded">
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="text-muted">Total Paid:</span>
                          <strong className="text-primary fs-5">{formatINR(order.totalPrice || 0)}</strong>
                        </div>
                        <div className="d-flex justify-content-between small text-muted">
                          <span>Payment Method:</span>
                          <span className="text-uppercase fw-bold">{order.paymentMethod || "UPI"}</span>
                        </div>
                        <div className="small text-muted mt-2 pt-2 border-top">
                          <i className="fas fa-location-dot me-1 text-danger"></i>
                          Delivery Address: {order.address?.city || "Bengaluru"}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default OrdersPage;
