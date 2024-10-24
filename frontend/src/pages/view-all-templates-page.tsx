import React, { useEffect, useState } from "react";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Badge,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import AppNavBar from "../components/common/app-nav-bar";
import TemplateList from "../components/home/template-list";
import { Template } from "../types";
import AppFooter from "../components/common/app-footer";
import { fetchTemplates } from "../services/template-service";
import { useLocation } from "react-router-dom";
import { XCircle } from "react-bootstrap-icons";

const ViewTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const searchResults = location.state?.results || []; // results passed from search bar
  const searchQuery = location.state?.query || ""; // get search query
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false); // track if search filter is active

  // fetch all templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data);
        setFilteredTemplates(data); // filteredTemplates same as all templates until search
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Failed to load templates. Please try again later.");
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // apply search filter if searchResults exist
  useEffect(() => {
    if (location.state && searchResults.length >= 0) {
      const filtered =
        searchResults.length > 0
          ? templates.filter((template) =>
              searchResults.some(
                (result: Template) => result.id === template.id
              )
            )
          : []; // if no results, filteredTemplates is empty array

      setFilteredTemplates(filtered);
      setIsSearchActive(true); // search is active
    } else {
      setFilteredTemplates(templates); // reset to all templates if no search
      setIsSearchActive(false); // get rid of active search
    }
  }, [searchResults, templates, location.state]);

  // clear search filter and reset to all templates
  const clearSearchFilter = () => {
    setFilteredTemplates(templates);
    setIsSearchActive(false);
  };

  return (
    <div className="bg-home">
      <AppNavBar />

      <Container className="p-4 home-page-crawl">
        {/* search badge */}
        {isSearchActive && (
          <Row className="mb-3">
            <Col>
              <Badge pill={false} className="custom-search-badge px-3">
                Search Results for "{searchQuery}"
                <Button
                  variant="link"
                  className="text-light"
                  onClick={clearSearchFilter}
                >
                  X
                </Button>
              </Badge>
            </Col>
          </Row>
        )}

        {/* toolbar */}
        <Row className="mb-3 justify-content-end">
          <Col xs="auto">
            <Form.Group controlId="topicSelect">
              <Form.Select
                aria-label="Filter by topic"
                className="input-focus-muted"
                defaultValue=""
              >
                <option value="" disabled>
                  Filter by topic...
                </option>
                <option value="Education">Education</option>
                <option value="Quiz">Quiz</option>
                <option value="Survey">Survey</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* template List */}
        <div className="tabs-container">
          <div className="recent-templates-container p-4">
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : isSearchActive && filteredTemplates.length === 0 ? (
              <div className="text-center">
                <XCircle size={50} className="text-muted mb-3" />
                <h4>No templates found for your search: "{searchQuery}"</h4>
                <p>Please try a different query or adjust your filters.</p>
              </div>
            ) : (
              <>
                <TemplateList
                  title={isSearchActive ? "Search Results" : "All Templates"}
                  templates={filteredTemplates}
                  type="recent"
                />
              </>
            )}
          </div>
        </div>
      </Container>

      <AppFooter />
    </div>
  );
};

export default ViewTemplatesPage;
