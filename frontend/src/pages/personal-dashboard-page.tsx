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
import { BugReport, Template, Response as formResponse } from "../types";
import { fetchTemplates, deleteTemplate } from "../services/template-service";
import { Pencil, Trash, SortUp, SortDown } from "react-bootstrap-icons";
import { fetchUserResponses } from "../services/user-service";
import { fetchUserJiraTickets } from "../services/ticket-service";

const PersonalDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [responses, setResponses] = useState<formResponse[]>([]);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [loadingBugReports, setLoadingBugReports] = useState<boolean>(true);
  const [bugReportsError, setBugReportsError] = useState<string | null>(null);
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

  // TODO: user management through this page
  // useEffect(() => {
  //   const loadUserDetails = async () => {
  //     try {
  //       const userData = await fetchUserById(id);
  //       setPageUser(userData.username);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Failed to fetch user details:", err);
  //       setError("Failed to load user details.");
  //       setLoading(false);
  //     }
  //   };

  //   loadUserDetails();
  // }, [id]);

  // fetch user responses on component mount
  useEffect(() => {
    const loadUserResponses = async () => {
      try {
        const userResponses = await fetchUserResponses(id!); // fetch responses for user
        setResponses(userResponses);
      } catch (err) {
        console.error("Failed to fetch user responses:", err);
        setError("Failed to load responses.");
      }
    };

    loadUserResponses();
  }, [id]);

  useEffect(() => {
    const loadBugReports = async () => {
      try {
        setBugReportsError(null); // reset bug reports error state
        const reports = await fetchUserJiraTickets(user!.email);
        console.log("Fetched bug reports:", reports);
        setBugReports(reports);
      } catch (err) {
        console.error("Failed to fetch bug reports:", err);
        setBugReportsError("Failed to load bug reports."); // set error
      } finally {
        setLoadingBugReports(false);
      }
    };

    if (user?.email) {
      loadBugReports();
    }
  }, [user]);

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      setTemplates(templates.filter((template) => template.id !== templateId));
    } catch (err) {
      console.error("Failed to delete template:", err);
    }
  };

  // table sorting logic
  const handleSort = (column: string) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    const sortedTemplates = [...templates].sort((a, b) => {
      const valA = a[column as keyof Template];
      const valB = b[column as keyof Template];

      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : // else desc
            valB.localeCompare(valA);
      }

      if (typeof valA === "object" && typeof valB === "object") {
        // sort dates
        return direction === "asc"
          ? new Date(valA as string).getTime() -
              new Date(valB as string).getTime()
          : // else desc
            new Date(valB as string).getTime() -
              new Date(valA as string).getTime();
      }

      return 0; // fallback in case of invalid values
    });

    setTemplates(sortedTemplates);
  };

  return (
    <div className="bg-home">
      <AppNavBar />
      <Container className="p-4 home-page-crawl">
        {/* user profile section */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={`https://i.pravatar.cc/300?u=${user?.username}`}
            alt="Profile"
            className="rounded-circle img-thumbnail"
            width="120"
          />
          {user && user.id === id ? (
            // TODO: username should be displayed in all cases when viewing user page
            <h5 className="ms-3 fw-bold fs-1 text-light">{user?.username}</h5>
          ) : (
            <h5 className="ms-3 fw-bold fs-2">{id}</h5>
          )}
        </div>

        {user && user.id === id && (
          <Button
            variant="outline-secondary"
            className="mb-4 custom-success-btn"
            onClick={() => alert("Edit Profile")}
          >
            <Pencil /> Edit Profile
          </Button>
        )}
        {/* dashboard tabs */}
        <Row>
          {/* fill up all the space */}
          <Col md={12}>
            <Tabs
              defaultActiveKey="templates"
              id="dashboard-tabs"
              className="tabs-container"
            >
              {/* templates tab */}
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
                      {user && (user.id === id || user.role === "admin") && (
                        <Button
                          variant="primary"
                          className="mb-3 custom-primary-btn"
                          onClick={() => navigate("/templates")}
                        >
                          Create New Template
                        </Button>
                      )}
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th onClick={() => handleSort("title")}>
                              Title{" "}
                              {sortColumn === "title" &&
                                (sortDirection === "asc" ? (
                                  <SortUp />
                                ) : (
                                  <SortDown />
                                ))}
                            </th>
                            <th onClick={() => handleSort("createdAt")}>
                              Date Created{" "}
                              {sortColumn === "createdAt" &&
                                (sortDirection === "asc" ? (
                                  <SortUp />
                                ) : (
                                  <SortDown />
                                ))}
                            </th>
                            {user &&
                              (user.id === id || user.role === "admin") && (
                                <th>Actions</th>
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {templates.map((template) => (
                            <tr key={template.id}>
                              <td>
                                <a href={`/forms/${template.id}`}>
                                  {template.title}
                                </a>
                              </td>
                              <td>
                                {format(new Date(template.createdAt), "P")}
                              </td>
                              {user &&
                                (user.id === id || user.role === "admin") && (
                                  <td className="d-flex flex-column">
                                    <Button
                                      variant="warning"
                                      className="me-2 mb-1 custom-outline-contrast-btn btn-sm"
                                      onClick={() =>
                                        navigate(`/templates/${template.id}`)
                                      }
                                    >
                                      <Pencil /> Edit
                                    </Button>
                                    <Button
                                      variant="danger"
                                      className="custom-delete-btn btn-sm"
                                      onClick={() =>
                                        handleDeleteTemplate(template.id)
                                      }
                                    >
                                      <Trash /> Delete
                                    </Button>
                                  </td>
                                )}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </>
                )}
              </Tab>

              {/* responses tab */}
              {user && (user.id === id || user.role === "admin") && (
                <Tab
                  eventKey="responses"
                  title={<span className="fw-bold fs-3">Responses</span>}
                >
                  <div className="recent-templates-container p-4">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("title")}>
                            Template Title{" "}
                            {sortColumn === "title" &&
                              (sortDirection === "asc" ? (
                                <SortUp />
                              ) : (
                                <SortDown />
                              ))}
                          </th>
                          <th onClick={() => handleSort("createdAt")}>
                            Date Submitted{" "}
                            {sortColumn === "createdAt" &&
                              (sortDirection === "asc" ? (
                                <SortUp />
                              ) : (
                                <SortDown />
                              ))}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {responses.length > 0 ? (
                          responses.map((response) => (
                            <tr key={response.id}>
                              <td>{response.template.title}</td>
                              <td>
                                {format(
                                  new Date(response.submittedAt),
                                  "MM-dd-yyyy"
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2}>No responses found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              )}
              {/* user bug reports */}
              {user && (user.id === id || user.role === "admin") && (
                <Tab
                  eventKey="bugReports"
                  title={<span className="fw-bold fs-3">Bug Reports</span>}
                >
                  {loadingBugReports ? (
                    <Spinner animation="border" />
                  ) : bugReportsError ? (
                    <Alert variant="danger">{bugReportsError}</Alert>
                  ) : bugReports.length === 0 ? (
                    <Alert variant="info">No bug reports found.</Alert>
                  ) : (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Summary</th>
                          <th>Template</th>
                          <th>Link</th>
                          <th>Priority</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bugReports.map((report) => (
                          <tr key={report.id}>
                            <td>{report.summary}</td>
                            <td>{report.template}</td>
                            <td>
                              <a
                                href={report.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {report.link}
                              </a>
                            </td>
                            <td>{report.priority}</td>
                            <td>{report.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Tab>
              )}
            </Tabs>
          </Col>
        </Row>
      </Container>
      <AppFooter />
    </div>
  );
};

export default PersonalDashboardPage;
