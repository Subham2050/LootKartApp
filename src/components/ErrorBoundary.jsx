import React from "react";
import { Container, Card, Button } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught Error Boundary caught an exception:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="my-5 text-center" style={{ maxWidth: "550px" }}>
          <Card className="shadow-lg border-0 rounded-4 p-4 my-5">
            <div className="display-1 text-danger mb-3">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <h3 className="fw-extrabold text-dark mb-2">Something went wrong!</h3>
            <p className="text-muted mb-4">
              An unexpected application error occurred. Don't worry, your cart items and settings are safe.
            </p>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                className="rounded-pill fw-bold"
                onClick={this.handleReload}
              >
                <i className="fas fa-rotate me-2"></i>Reload Application
              </Button>
            </div>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
