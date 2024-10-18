import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  TwitterX,
} from "react-bootstrap-icons";

const AppFooter: React.FC = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <Container>
        <Row className="mb-4">
          {/* Logo and About Section */}
          <Col md={4}>
            <h4 className="fw-bold">QuickFormr</h4>
            <p className="text-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              scelerisque urna in nulla efficitur, a consectetur odio gravida.
              Ut tempor orci non metus laoreet, ac dignissim arcu gravida.
            </p>
          </Col>

          {/* useful links (placeholders) */}
          <Col md={4}>
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-light text-decoration-none">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </Col>

          {/* socials */}
          <Col md={4} className="text-end">
            <h5 className="fw-bold">Follow Us</h5>
            <p className="text-light">
              Connect with us on social media to stay updated with the latest
              updates.
            </p>
            <div className="d-flex justify-content-end">
              <a href="#" className="text-light me-3">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-light me-3">
                <TwitterX size={24} />
              </a>
              <a href="#" className="text-light me-3">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-light me-3">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-light">
                <Github size={24} />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary" />

        {/* footer bottom */}
        <Row>
          <Col className="text-end">
            <p className="mb-0 text-light">
              &copy; 20XX QuickFormr. All rights reserved.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
