import React from "react";

function Rating({ value = 0, text, color = "#f8b800" }) {
  const numericValue = Number(value) || 0;

  return (
    <div className="rating d-flex align-items-center">
      <span className="me-1">
        <i
          style={{ color }}
          className={
            numericValue >= 1
              ? "fas fa-star"
              : numericValue >= 0.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }></i>
      </span>
      <span className="me-1">
        <i
          style={{ color }}
          className={
            numericValue >= 2
              ? "fas fa-star"
              : numericValue >= 1.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }></i>
      </span>
      <span className="me-1">
        <i
          style={{ color }}
          className={
            numericValue >= 3
              ? "fas fa-star"
              : numericValue >= 2.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }></i>
      </span>
      <span className="me-1">
        <i
          style={{ color }}
          className={
            numericValue >= 4
              ? "fas fa-star"
              : numericValue >= 3.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }></i>
      </span>
      <span className="me-2">
        <i
          style={{ color }}
          className={
            numericValue >= 5
              ? "fas fa-star"
              : numericValue >= 4.5
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }></i>
      </span>
      {text && <span className="ms-1 text-muted small">{text}</span>}
    </div>
  );
}

export default Rating;

