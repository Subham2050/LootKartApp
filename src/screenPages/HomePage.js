import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";

function HomePage() {
  const URL = "https://fakestoreapi.com/products";
  const [data, SetData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const response = await axios.get(URL);
      SetData(response.data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div>
      <Container>
        <Row>
          {loading ? (
            <h4> Loading...</h4>
          ) : (
            data.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
