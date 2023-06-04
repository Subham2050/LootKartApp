import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import "../Product.css";

function Product({ product }) {
  return (
    <Card className="mx-auto my-3">
      <div className="card-image-container">
        <Link to={`products/${product.id}`}>
          <Card.Img variant="top" src={product.image} />
        </Link>
      </div>
      <Card.Body>
        <Link to={`/products/${product.id}`} style={{ textDecoration: "none" }}>
          <Card.Title as="div">{product.name}</Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="py-3">
            <Rating
              value={product.rating.rate}
              text={`${product.rating.count} reviews`}
              color="#f8e825"
            />
          </div>
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Product;
