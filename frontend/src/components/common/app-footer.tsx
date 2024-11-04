import React, { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  TwitterX,
} from "react-bootstrap-icons";
import { createJiraTicket } from "../../services/ticket-service";

const AppFooter: React.FC = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleSupportSubmit = async () => {
    try {
      await createJiraTicket(summary, priority);
      alert("Ticket created successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } // display error message if ticket creation fails
    } finally {
      setShowSupportModal(false);
    }
  };

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
                <a
                  href="#"
                  className="text-light text-decoration-none"
                  onClick={() => setShowSupportModal(true)}
                >
                  Support
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
              &copy; 20XX QuickFormr. All rights reserved. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Support Modal */}
      <Modal show={showSupportModal} onHide={() => setShowSupportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Support</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Issue Summary</Form.Label>
              <Form.Control
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly describe your issue"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSupportModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSupportSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </footer>
  );
};

export default AppFooter;
