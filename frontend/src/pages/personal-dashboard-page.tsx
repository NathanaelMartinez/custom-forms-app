import React, { useEffect, useState } from "react";
import {
  Container,
  Tab,
  Tabs,
  Spinner,
  Alert,
  Table,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "../context/auth-context";
import AppNavBar from "../components/common/app-nav-bar";
import AppFooter from "../components/common/app-footer";
import { Template } from "../types";
import { fetchTemplates, deleteTemplate } from "../services/template-service";
import { Pencil, Trash } from "react-bootstrap-icons";

const PersonalDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  // fetch templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates();
        const userTemplates = data.filter(
          (template: Template) => template.author.id === id
        );
        setTemplates(userTemplates);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Failed to load templates. Please try again later.");
        setLoading(false);
      }
    };

    loadTemplates();
  }, [id]);

  // Handle template deletion
  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      setTemplates(templates.filter((template) => template.id !== templateId));
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  };

  // Sorting logic
  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    const sortedTemplates = [...templates].sort((a, b) => {
      const valA = a[column as keyof Template];
      const valB = b[column as keyof Template];

      if (valA && valB) {
        if (typeof valA === "string" && typeof valB === "string") {
          return direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else if (typeof valA === "object" && typeof valB === "object") {
          // Sorting dates
          return direction === "asc"
            ? new Date(valA as string).getTime() -
                new Date(valB as string).getTime()
            : new Date(valB as string).getTime() -
                new Date(valA as string).getTime();
        }
      }
      return 0;
    });

    setTemplates(sortedTemplates);
  };

  return (
    <>
      <AppNavBar />
      <Container className="p-4 home-page-crawl">
        {/* user profile section */}
        <div className="d-flex align-items-center mb-3">
          <img
            src="https://i.pravatar.cc/300"
            alt="Profile"
            className="rounded-circle img-thumbnail"
            width="120"
          />
          <h5 className="ms-3">{user?.username}</h5>
        </div>

        <Button
          variant="outline-secondary"
          className="mb-4 custom-outline-secondary-btn"
          onClick={() => alert("Edit Profile")} // TODO: allow profile editing
        >
          <Pencil /> Edit Profile
        </Button>

        {/* Dashboard Tabs */}
        <Row>
          <Col md={12}>
            <Tabs
              defaultActiveKey="templates"
              id="dashboard-tabs"
              className="tabs-container"
            >
              {/* templates Tab */}
              <Tab
                eventKey="templates"
                title={<span className="fw-bold fs-3">Templates</span>}
              >
                {loading ? (
                  <Spinner animation="border" />
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <>
                    <div className="recent-templates-container p-4">
                      <Button
                        variant="primary"
                        className="mb-3 custom-primary-btn"
                        onClick={() => navigate("/create-template")}
                      >
                        Create New Template
                      </Button>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th onClick={() => handleSort("title")}>
                              Title{" "}
                              {sortColumn === "title" &&
                                (sortDirection === "asc" ? "▲" : "▼")}
                            </th>
                            <th onClick={() => handleSort("createdAt")}>
                              Date Created{" "}
                              {sortColumn === "createdAt" &&
                                (sortDirection === "asc" ? "▲" : "▼")}
                            </th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {templates.map((template) => (
                            <tr key={template.id}>
                              <td>
                                <a href={`/templates/${template.id}`}>
                                  {template.title}
                                </a>
                              </td>
                              <td>
                                {format(
                                  new Date(template.createdAt),
                                  "MM-dd-yyyy"
                                )}
                              </td>
                              <td className="d-flex justify-content-evenly">
                                <Button
                                  variant="warning"
                                  className="me-2 custom-outline-contrast-btn"
                                  onClick={() =>
                                    navigate(`/edit-template/${template.id}`)
                                  }
                                >
                                 <Pencil /> Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  className="custom-delete-btn"
                                  onClick={() =>
                                    handleDeleteTemplate(template.id)
                                  }
                                >
                                  <Trash /> Delete
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </>
                )}
              </Tab>

              {/* Responses Tab */}
              <Tab
                eventKey="responses"
                title={<span className="fw-bold fs-3">Responses</span>}
              >
                <div className="recent-templates-container p-4">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Form Title</th>
                        <th>Number of Responses</th>
                      </tr>
                    </thead>
                    <tbody>{/* Add your placeholder responses */}</tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
      <AppFooter />
    </>
  );
};

export default PersonalDashboardPage;
