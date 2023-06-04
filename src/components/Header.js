import React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
function Header() {
  return (
    <header>
      <Navbar bg="primary" variant="dark">
        <Container>
            <LinkContainer to="/">
                <Navbar.Brand>LootKarT</Navbar.Brand>
            </LinkContainer>
                <Nav className="me-auto">
                    <LinkContainer to="/cart">
                        <Nav.Link><i className='fas fa-cart-shopping'></i>&nbsp;Cart</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/login">
                        <Nav.Link><i className='fas fa-user'></i>&nbsp;Login</Nav.Link>
                    </LinkContainer>
                </Nav>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
