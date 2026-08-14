import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer className="mt-auto py-3 bg-light border-top">
      <Container>
        <Row>
          <Col className="text-center text-muted">
            Copyright &copy; {new Date().getFullYear()} LootKart. All Rights Reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

