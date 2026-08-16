import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { formatINR } from "../utils/formatCurrency";
import { useOrders } from "../context/OrderContext";
import api from "../services/api";

function CheckoutModal({ show, handleClose, cartItems, totalPrice, clearCart }) {
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "upi",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "LOOT10") {
      const disc = totalPrice * 0.1;
      setDiscountAmount(disc);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code! Try code 'LOOT10'");
    }
  };

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      items: cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        image: item.image,
      })),
      totalPrice: finalPrice,
      address: formData,
      paymentMethod: formData.paymentMethod,
    };

    let serverOrderId = "";

    // 1. Post to FastAPI Backend (with Redis Idempotency Key)
    try {
      const res = await api.post("/orders", orderPayload);
      if (res.data && res.data.id) {
        serverOrderId = res.data.id;
      }
    } catch (err) {
      console.warn("Backend order placement unavailable, recording locally", err);
    }

    // 2. Save in local OrderContext
    const createdOrder = addOrder({
      id: serverOrderId || undefined,
      items: cartItems,
      totalPrice: finalPrice,
      address: formData,
      paymentMethod: formData.paymentMethod,
    });

    setPlacedOrderId(serverOrderId || createdOrder.id);
    setIsSubmitting(false);
    setStep(3);
    clearCart();
  };

  const resetModal = () => {
    setStep(1);
    setCouponApplied(false);
    setDiscountAmount(0);
    setCouponCode("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={resetModal} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">
          {step === 1 && "1. Shipping & Delivery Address"}
          {step === 2 && "2. Select Payment Method"}
          {step === 3 && "Order Confirmed! 🎉"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {step === 1 && (
          <Form onSubmit={() => setStep(2)}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    required
                    placeholder="Subham Kumar"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Mobile Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Delivery Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    required
                    placeholder="Flat 102, Green Valley Apartments, MG Road"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">City *</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    required
                    placeholder="Bengaluru"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Pincode *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    required
                    placeholder="560001"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <Button variant="secondary" onClick={resetModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="fw-bold px-4">
                Proceed to Payment <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </div>
          </Form>
        )}

        {step === 2 && (
          <div>
            <div className="p-3 bg-light rounded mb-4">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Items Subtotal:</span>
                <span>{formatINR(totalPrice)}</span>
              </div>
              {couponApplied && (
                <div className="d-flex justify-content-between mb-2 text-success fw-semibold">
                  <span>Coupon Discount (10% OFF):</span>
                  <span>- {formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2 text-muted">
                <span>Delivery Charge:</span>
                <span className="text-success fw-bold">FREE</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fs-5 fw-bold text-dark">
                <span>Grand Total:</span>
                <span className="text-primary">{formatINR(finalPrice)}</span>
              </div>

              <div className="mt-3 d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Enter Coupon Code (e.g. LOOT10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                />
                <Button
                  variant="outline-primary"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied}
                >
                  {couponApplied ? "Applied!" : "Apply"}
                </Button>
              </div>
            </div>

            <Form onSubmit={handlePlaceOrder}>
              <h5 className="fw-bold mb-3">Select Payment Method</h5>
              <Form.Check
                type="radio"
                id="upi"
                name="paymentMethod"
                label="UPI / Google Pay / PhonePe / Paytm"
                value="upi"
                checked={formData.paymentMethod === "upi"}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded"
              />
              <Form.Check
                type="radio"
                id="card"
                name="paymentMethod"
                label="Credit / Debit Card (Visa, Mastercard, RuPay)"
                value="card"
                checked={formData.paymentMethod === "card"}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded"
              />
              <Form.Check
                type="radio"
                id="cod"
                name="paymentMethod"
                label="Cash on Delivery (COD)"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleInputChange}
                className="mb-2 p-2 border rounded"
              />

              <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <Button variant="outline-secondary" onClick={() => setStep(1)} disabled={isSubmitting}>
                  <i className="fas fa-arrow-left me-2"></i> Back to Shipping
                </Button>
                <Button variant="success" type="submit" size="lg" className="fw-bold px-4" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span><i className="fas fa-spinner fa-spin me-2"></i>Processing Order...</span>
                  ) : (
                    <span><i className="fas fa-lock me-2"></i> Place Order ({formatINR(finalPrice)})</span>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <div className="display-1 text-success mb-3">
              <i className="fas fa-circle-check"></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">Thank You for Your Order!</h2>
            <p className="text-muted fs-5 mb-4">
              Order ID: <strong>#{placedOrderId}</strong>
            </p>
            <Alert variant="success" className="text-start mx-auto" style={{ maxWidth: "500px" }}>
              <div className="fw-bold mb-1">
                <i className="fas fa-truck me-2"></i>Estimated Delivery: Tomorrow by 8:00 PM
              </div>
              <div className="small text-muted">
                Confirmation SMS & Email sent to <strong>{formData.phone || "your number"}</strong>.
              </div>
            </Alert>
            <Button variant="primary" size="lg" className="mt-3 px-5 rounded-pill fw-bold" onClick={resetModal}>
              Continue Shopping
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default CheckoutModal;
