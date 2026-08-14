import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Nav, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

function LoginPage({ onToast }) {
  const { login, register, isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    const loggedUser = login(formData.email, formData.password);
    if (onToast) {
      onToast(`Welcome back, ${loggedUser.name}! 👋`, "success");
    }
    navigate(redirectPath);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMsg("Please complete all required fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    const registeredUser = register(formData.name, formData.email, formData.password);
    if (onToast) {
      onToast(`Account created! Welcome to LootKart, ${registeredUser.name}! 🎉`, "success");
    }
    navigate(redirectPath);
  };

  if (isLoggedIn) {
    return (
      <Container className="my-5 text-center" style={{ maxWidth: "500px" }}>
        <Card className="p-4 shadow-sm border rounded-4">
          <div className="display-4 text-primary mb-3">
            <i className="fas fa-circle-user"></i>
          </div>
          <h3 className="fw-bold text-dark mb-2">You are Logged In!</h3>
          <p className="text-muted">Signed in as <strong>{user?.email}</strong></p>
          <div className="d-grid gap-2 mt-4">
            <Link to="/" className="btn btn-primary rounded-pill fw-bold py-2">
              Explore Catalog
            </Link>
            <Link to="/cart" className="btn btn-outline-secondary rounded-pill fw-bold py-2">
              View Shopping Cart
            </Link>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: "480px" }}>
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        <Card.Header className="bg-white border-bottom-0 pt-4 px-4 pb-0 text-center">
          <h3 className="fw-extrabold text-primary mb-1">
            <i className="fas fa-bag-shopping me-2"></i>LootKart
          </h3>
          <p className="text-muted small">Sign in to access your orders, wishlist, & rewards</p>

          <Nav variant="pills" justify className="mt-3 bg-light p-1 rounded-pill">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "login"}
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg("");
                }}
                className="rounded-pill fw-bold py-2"
                style={{ cursor: "pointer" }}
              >
                Sign In
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "register"}
                onClick={() => {
                  setActiveTab("register");
                  setErrorMsg("");
                }}
                className="rounded-pill fw-bold py-2"
                style={{ cursor: "pointer" }}
              >
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>

        <Card.Body className="p-4">
          {errorMsg && <Alert variant="danger" className="py-2 small">{errorMsg}</Alert>}

          {activeTab === "login" ? (
            <Form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Email Address / Mobile *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Form.Group>

              <Button type="submit" variant="primary" size="lg" className="w-100 fw-bold rounded-pill my-3">
                Sign In
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleRegisterSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Full Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  required
                  placeholder="Subham Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Email Address *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  required
                  placeholder="subham@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small">Confirm Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="rounded-3"
                />
              </Form.Group>

              <Button type="submit" variant="success" size="lg" className="w-100 fw-bold rounded-pill my-3">
                Create Free Account
              </Button>
            </Form>
          )}

          <div className="position-relative text-center my-3">
            <hr />
            <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted extra-small">
              OR CONTINUE WITH
            </span>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="w-100 rounded-pill small fw-semibold"
              onClick={() => {
                login("user.google@gmail.com", "password");
                if (onToast) onToast("Signed in with Google!", "success");
                navigate(redirectPath);
              }}
            >
              <i className="fab fa-google text-danger me-2"></i>Google
            </Button>
            <Button
              variant="outline-secondary"
              className="w-100 rounded-pill small fw-semibold"
              onClick={() => {
                login("mobile.user@lootkart.com", "password");
                if (onToast) onToast("Signed in via Mobile OTP!", "success");
                navigate(redirectPath);
              }}
            >
              <i className="fas fa-mobile-screen-button text-primary me-2"></i>Mobile OTP
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
