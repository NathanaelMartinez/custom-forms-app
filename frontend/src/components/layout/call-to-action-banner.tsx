import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const CallToAction: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <Container className="py-3 banner-dark text-light">
      <Row className="align-items-center justify-content-evenly">
        <Col md={8}>
          <h3 className="text-center fw-bold">
            Can't find what you're looking for?
          </h3>
        </Col>
        <Col md={4} className="text-center">
          <div className="me-5">
            {isLoggedIn ? (
              <span className="fw-bold">Create your own custom Form!</span>
            ) : (
              <span className="fw-bold">
                Sign Up now and make your own custom Forms!
              </span>
            )}
            <div className="mt-2">
              <Button
                variant="primary"
                className="custom-primary-btn"
                onClick={() =>
                  navigate(isLoggedIn ? "/create-template" : "/sign-up")
                }
                size="lg"
              >
                {isLoggedIn ? "Create Template" : "Sign Up"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CallToAction;
