import React from "react";
import { Col } from "react-bootstrap";

interface ProductPitchProps {
  imageSrc: string;
  title: string;
  description: string;
}

const ProductPitch: React.FC<ProductPitchProps> = ({ imageSrc, title, description }) => {
  return (
    <Col md={7} className="d-flex justify-content-center align-items-center">
      <div className="product-info position-relative bg-secondary p-4 rounded text-center">
        <img src={imageSrc} alt={title} className="img-fluid rounded" />
        <div className="overlay-text position-absolute bottom-0 start-0 p-4">
          <h2 className="fw-bold">{title}</h2>
          <p>{description}</p>
        </div>
        <a href="http://www.freepik.com" className="attribution-link position-absolute">
          Designed by studiogstock / Freepik
        </a>
      </div>
    </Col>
  );
};

export default ProductPitch;
