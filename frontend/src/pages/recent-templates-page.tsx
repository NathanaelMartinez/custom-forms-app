import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs, Spinner, Alert } from "react-bootstrap";
import AppNavBar from "../components/common/app-nav-bar";
import TemplateList from "../components/dashboard/template-list";
import { Template } from "../types";
import AppFooter from "../components/common/app-footer";
import { fetchTemplates } from "../services/template-service";

const RecentTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetch templates when component mounts
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        setTemplates(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Failed to load templates. Please try again later.");
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // sort templates by creation date for recent templates
  const recentTemplates = [...templates]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  return (
    <>
      <AppNavBar />

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
              </>
            )}
          </Tab>
        </Tabs>
      </Container>

      <AppFooter />
    </>
  );
};

export default RecentTemplatesPage;
