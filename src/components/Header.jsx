import React from 'react';
import { Container, Nav, Navbar, Badge, Form, InputGroup, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useOrders } from '../context/OrderContext';

function Header({ searchTerm = "", setSearchTerm }) {
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { orderCount } = useOrders();

  return (
    <header>
      {/* Top Announcement Bar */}
      <div className="announcement-bar text-center">
        <Container>
          <span>
            <i className="fas fa-bullhorn me-2"></i>
            FESTIVAL SALE IS LIVE! Use code <strong className="text-white">LOOT10</strong> for extra 10% OFF | Free Shipping over ₹499
          </span>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="navbar-custom">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="brand-text d-flex align-items-center me-4">
              <i className="fas fa-bag-shopping me-2 text-primary"></i>LootKart
            </Navbar.Brand>
          </LinkContainer>

          {setSearchTerm && (
            <Form className="d-flex flex-grow-1 mx-lg-4 my-2 my-lg-0" style={{ maxWidth: "450px" }}>
              <InputGroup>
                <Form.Control
                  type="search"
                  placeholder="Search electronics, fashion, jewelery..."
                  className="nav-search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Form>
          )}

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-lg-center gap-2">
              <LinkContainer to="/">
                <Nav.Link className="fw-bold">Home</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/orders">
                <Nav.Link className="fw-bold position-relative">
                  <i className="fas fa-box text-primary me-1"></i> Orders
                  {orderCount > 0 && (
                    <Badge pill bg="info" className="ms-1">
                      {orderCount}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/wishlist">
                <Nav.Link className="fw-bold position-relative">
                  <i className="fas fa-heart text-danger me-1"></i> Wishlist
                  {wishlistCount > 0 && (
                    <Badge pill bg="danger" className="ms-1">
                      {wishlistCount}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              <LinkContainer to="/cart">
                <Nav.Link className="fw-bold position-relative">
                  <i className="fas fa-shopping-cart text-primary me-1"></i> Cart
                  {totalItems > 0 && (
                    <Badge pill bg="warning" text="dark" className="ms-1 fw-bold">
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* Dark/Light Theme Toggle */}
              <Button
                variant="link"
                className="nav-link px-2 fs-5 border-0"
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <i className={isDark ? "fas fa-sun text-warning" : "fas fa-moon text-secondary"}></i>
              </Button>

              {isLoggedIn ? (
                <NavDropdown
                  title={
                    <span className="fw-bold">
                      <i className="fas fa-circle-user text-primary me-1"></i> Hi, {user?.name || "User"} 👋
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end"
                  className="ms-lg-2"
                >
                  <NavDropdown.Item disabled className="small text-muted border-bottom">
                    Signed in as <strong>{user?.email}</strong>
                  </NavDropdown.Item>
                  <LinkContainer to="/orders">
                    <NavDropdown.Item>
                      <i className="fas fa-box-open me-2 text-primary"></i> My Orders ({orderCount})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/wishlist">
                    <NavDropdown.Item>
                      <i className="fas fa-heart me-2 text-danger"></i> My Wishlist ({wishlistCount})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/cart">
                    <NavDropdown.Item>
                      <i className="fas fa-shopping-bag me-2 text-primary"></i> My Cart ({totalItems})
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout} className="text-danger fw-semibold">
                    <i className="fas fa-right-from-bracket me-2"></i> Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-bold text-primary ms-lg-2">
                    <i className="fas fa-user me-1"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
