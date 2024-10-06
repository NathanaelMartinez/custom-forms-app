import React from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

const SearchBar: React.FC = () => {
  return (
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
  );
};

export default SearchBar;
