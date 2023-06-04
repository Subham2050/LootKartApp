import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'

function Footer() {
  return (
    <footer style={{left:0, right:0,bottom:0, position: 'relative'}}>
      <Container>
        <Row>
            <Col className='text-center py-3'>Copyright &copy; LootKart</Col>
        </Row>
    </Container>
    </footer>
  )
}

export default Footer
