import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { searchTemplates } from "../../services/template-service";
import { Template } from "../../types";

const AppSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState(""); // to store search input
  const [searchResults, setSearchResults] = useState<Template[]>([]); // to store search results

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent page reload on form submission
    try {
      const results = await searchTemplates(searchTerm); // call search function
      setSearchResults(results); // update state with search results
      console.log("Search Results:", results); // TODO: create search results page
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
                  className="me-2"
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

      {/* you can display search results below */}
      <div>
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results:</h3>
            {searchResults.map((result) => (
              <div key={result.id}>
                <h4>{result.title}</h4>
                <p>{result.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AppSearchBar;
