import React, { useEffect, useState } from "react";
import { Button, Container, Tab, Tabs, Spinner, Alert } from "react-bootstrap";
import AppNavBar from "../components/common/app-nav-bar";
import CallToAction from "../components/dashboard/call-to-action-banner";
import TemplateList from "../components/dashboard/template-list";
import { Template } from "../types";
import AppFooter from "../components/common/app-footer";
import { fetchTemplates } from "../services/template-service"; // Import the fetchTemplates function

const HomePage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the templates when the component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data); // Set the fetched templates
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Failed to load templates. Please try again later.");
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Sort templates by filledForms (number of responses) in descending order for top templates
  const popularTemplates = [...templates]
  .sort((a, b) => ((b.responses?.length ?? 0) - (a.responses?.length ?? 0)))
  .slice(0, 5); // Get top 5 templates based on responses count

    

  // Sort templates by creation date for recent templates
  const recentTemplates = [...templates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <AppNavBar />

      <Container className="p-4 home-page-crawl">
        {/* Loading and Error Handling */}
        {loading ? (
          <Spinner animation="border" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <>
            {/* Top Templates (based on filledForms) */}
            <TemplateList
              title="Top Templates"
              templates={popularTemplates}
              type="top"
            />
          </>
        )}
      </Container>

      <CallToAction />

      <Container className="p-4 home-page-crawl">
        <Tabs defaultActiveKey="new-templates" className="tabs-container">
          <Tab
            eventKey="new-templates"
            title={<span className="fw-bold fs-3">New Templates</span>}
            className="recent-templates-container p-4"
          >
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : (
              <>
                <TemplateList
                  title=""
                  templates={recentTemplates}
                  type="recent"
                />
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="primary" className="custom-primary-btn">
                    Load More Templates
                  </Button>
                </div>
              </>
            )}
          </Tab>
        </Tabs>
      </Container>

      <AppFooter />
    </>
  );
};

export default HomePage;
