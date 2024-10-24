import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { searchTemplates } from "../../services/template-service";
import { useNavigate } from "react-router-dom";

const AppSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState(""); // to store search input
  const navigate = useNavigate()

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent page reload on form submission
    try {
      const results = await searchTemplates(searchTerm); // call search function
      navigate("/view-templates", { state: { results, query: searchTerm } }); // pass search variables to results page
      console.log("Search Results:", results);
    } catch (error) {
      console.error("Error searching templates:", error);
    }
  };

  return (
    <>
      <div className={"bg-dark text-center pb-4"}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form className="d-flex justify-content-center" onSubmit={handleSearch}>
                <Form.Control
                  type="text"
                  placeholder="I need a form for..."
                  className="me-2 input-focus-muted"
                  value={searchTerm} // bind input value to state
                  onChange={(e) => setSearchTerm(e.target.value)} // update state on input change
                />
                <Button variant="primary" className="custom-primary-btn" type="submit">
                  <Search />
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AppSearchBar;
