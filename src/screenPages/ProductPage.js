import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  Container,
  ListGroup,
  Button,
  ListGroupItem,
} from "react-bootstrap";
// import products from "../dummyProducts";
import Rating from "../components/Rating";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function ProductPage() {
  let { id } = useParams();
  const [singleProduct, setSingleProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = `https://fakestoreapi.com/products/${id}`;
  //   const product = products.find((p) => p._id == id);
  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const response = await axios.get(URL);
      setSingleProduct(response.data);
      console.log(response.data);
      setLoading(false);
    };
    loadProduct();
  }, []);
  return (
    <div>
      <Container>
        <Link to="/" className="btn">
          <h4>
            <i className="fa-solid fa-arrow-left"></i>&nbsp;Go Back
          </h4>
        </Link>
        <Row>
          {loading ? (
            <h4>Loading...</h4>
          ) : (
            <>
              <Col md={6}>
                <div style={{ height: "500px" }}>
                  <Image
                    src={singleProduct.image}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </Col>
              <Col md={3}>
                <ListGroup>
                  <ListGroupItem>{singleProduct.name}</ListGroupItem>
                  <ListGroupItem>
                    <Rating
                      value={singleProduct?.rating?.rate}
                      text={`${singleProduct?.rating?.count} reviews`}
                      color="#f8e825"
                    />
                  </ListGroupItem>
                  <ListGroupItem>${singleProduct.price}</ListGroupItem>
                  <ListGroupItem>{singleProduct.description}</ListGroupItem>
                </ListGroup>
              </Col>
              <Col md={3}>
                <ListGroup>
                  <ListGroupItem>Price: ${singleProduct.price}</ListGroupItem>
                  <ListGroupItem>
                    {singleProduct.countInStock > 0
                      ? "Hurry! few stocks available"
                      : "Out of Stock Today!"}
                  </ListGroupItem>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={singleProduct.countInStock == 0}>
                    Add to Cart
                  </Button>
                </ListGroup>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default ProductPage;
