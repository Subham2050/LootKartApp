import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function HeroBanner({ onShopNowClick }) {
  return (
    <div className="hero-banner my-4">
      <Row className="align-items-center">
        <Col lg={7} className="mb-4 mb-lg-0">
          <span className="hero-tag mb-3">
            <i className="fas fa-bolt me-1"></i> FESTIVAL DEALS LIVE NOW
          </span>
          <h1 className="display-4 fw-extrabold mb-3">
            Upgrade Your Tech & Style with <span className="text-warning">LootKart</span>
          </h1>
          <p className="lead mb-4 opacity-90">
            Discover thousands of premium electronics, fashion, and lifestyle products at unbeatable Indian prices. Free express delivery on orders over ₹499!
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Button
              variant="warning"
              size="lg"
              className="fw-bold px-4 rounded-pill shadow-sm"
              onClick={onShopNowClick}
            >
              <i className="fas fa-shopping-bag me-2"></i>Explore Deals
            </Button>
            <Button
              variant="outline-light"
              size="lg"
              className="fw-bold px-4 rounded-pill"
              onClick={onShopNowClick}
            >
              Top Categories
            </Button>
          </div>
        </Col>
        <Col lg={5} className="text-center">
          <div className="p-4 bg-white bg-opacity-10 rounded-4 border border-white border-opacity-25 backdrop-blur">
            <h4 className="fw-bold mb-3 text-warning">
              <i className="fas fa-gift me-2"></i>Exclusive Bank Offer
            </h4>
            <p className="mb-3 fs-5">Get Instant <strong>10% Cashback</strong> on HDFC & SBI Credit Cards!</p>
            <div className="d-flex justify-content-around mt-4 pt-3 border-top border-white border-opacity-25 text-start">
              <div>
                <i className="fas fa-truck-fast fs-3 text-warning mb-1"></i>
                <div className="fw-bold small">Free Delivery</div>
                <div className="small opacity-75">Over ₹499</div>
              </div>
              <div>
                <i className="fas fa-undo fs-3 text-warning mb-1"></i>
                <div className="fw-bold small">7 Days Return</div>
                <div className="small opacity-75">No Questions Asked</div>
              </div>
              <div>
                <i className="fas fa-shield-halved fs-3 text-warning mb-1"></i>
                <div className="fw-bold small">100% Genuine</div>
                <div className="small opacity-75">Verified Sellers</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default HeroBanner;
