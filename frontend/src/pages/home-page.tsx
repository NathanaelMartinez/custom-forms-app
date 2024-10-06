import React from "react";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import AppNavBar from "../components/app-nav-bar";
import { useAuth } from "../context/auth-context";

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth(); // use auth context
  const navigate = useNavigate();

  // placeholder data for top 5 all-time templates
  const popularTemplates = [
    { id: 1, name: "Top Form Template 1", filledForms: 120 },
    { id: 2, name: "Top Form Template 2", filledForms: 95 },
    { id: 3, name: "Top Form Template 3", filledForms: 85 },
    { id: 4, name: "Top Form Template 4", filledForms: 70 },
    { id: 5, name: "Top Form Template 5", filledForms: 50 },
  ];

  const recentTemplates = [
    { id: 1, name: "Recent Form Template 1", dateCreated: "2024-01-01" },
    { id: 2, name: "Recent Form Template 2", dateCreated: "2024-01-05" },
    { id: 3, name: "Recent Form Template 3", dateCreated: "2024-01-10" },
  ];

  return (
    <>
      <AppNavBar />

      {/* search bar section */}
      <div className="bg-dark py-5 text-center">
        <Container fluid>
          <h2 className="text-light fw-bold mb-3">
            Discover and Create Custom Forms
          </h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form className="d-flex justify-content-center">
                <Form.Control
                  type="text"
                  placeholder="I need a form for..."
                  className="w-75"
                />
                <Button variant="primary" className="ms-2 custom-primary-btn">
                  <Search />
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="p-4 bg-light">
        {/* top 5 all-time templates section */}
        <section className="popular-templates">
          <h3 className="mb-4 text-start fw-bold">Top Templates</h3>
          <Row className="justify-content-center">
            {popularTemplates.map((template) => (
              <Col key={template.id} className="mb-4">
                <Card className="template-card">
                  <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                    <Card.Title className="fw-bold">{template.name}</Card.Title>
                    <Card.Text>Filled Forms: {template.filledForms}</Card.Text>
                  </Card.ImgOverlay>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* create template or sign-up bar */}
      <Container className="py-3 bg-dark text-light rounded">
        <Row className="align-items-center justify-content-center">
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
                  onClick={() => navigate(isLoggedIn ? "/create-template" : "/sign-up")}
                  size="lg"
                >
                  {isLoggedIn ? "Create Template" : "Sign Up"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="p-4 bg-light">
        {/* recent templates section */}
        <section className="recent-templates bg-secondary rounded p-4">
          <h3 className="mb-4 text-start text-light fw-bold">New Templates</h3>
          <Row>
            {recentTemplates.map((template) => (
              <Col key={template.id} sm={6} md={4} lg={2} className="mb-4">
                <Card className="template-card">
                  <Card.ImgOverlay className="d-flex flex-column justify-content-end">
                    <Card.Title className="fw-bold">{template.name}</Card.Title>
                    <Card.Text>Date Created: {template.dateCreated}</Card.Text>
                  </Card.ImgOverlay>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-4">
            <Button variant="primary" className="custom-primary-btn" disabled>
              Load More Templates
            </Button>
          </div>
        </section>
      </Container>
    </>
  );
};

export default HomePage;
