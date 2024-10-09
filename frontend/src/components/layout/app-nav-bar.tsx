import React from "react";
import {
  Navbar,
  Nav,
  Button,
  Dropdown,
  Container,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  PersonCircle,
  ShieldFill,
  Search,
  PersonLock,
} from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const AppNavBar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogInClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  const isHomePage = location.pathname === "/"; // for extra features

  return (
    <>
      <Navbar bg="dark" expand="lg" className="mb-0 py-1">
        <Container fluid>
          <Navbar.Brand href="/" className="fw-bold fs-2 ms-4 custom-icon-btn">
            QuickFormr
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              {isLoggedIn ? (
                <>
                  {/* <Button
                    variant="link"
                    className="p-0 me-2 custom-icon-btn"
                    onClick={() => navigate("/saved-templates")}
                  >
                    <BookmarkFill size={36} className="text-light" />
                  </Button> */}

                  {user?.role === "admin" && (
                    <Button
                      variant="link"
                      className="p-0 admin-icon-btn"
                      onClick={() => navigate("/admin-panel")}
                    >
                      <ShieldFill size={36} />
                    </Button>
                  )}

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      id="profile-dropdown"
                      className="d-flex me-3 align-items-center custom-icon-btn"
                    >
                      {user?.status === "active" ? (
                        <PersonCircle size={36} />
                      ) : (
                        <PersonLock size={36} />
                      )}
                      <span className="ms-2">{user?.username}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Dropdown.Item onClick={() => navigate("/account")}>
                        Account
                      </Dropdown.Item>
                      {/* <Dropdown.Item onClick={() => navigate("/saved-templates")}>
                        Saved Templates
                      </Dropdown.Item> */}
                      {user?.role === "admin" && (
                        <Dropdown.Item onClick={() => navigate("/admin-panel")}>
                          Admin Panel
                        </Dropdown.Item>
                      )}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout} className="text-danger">
                        Log Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={handleLogInClick}
                    className="me-2 custom-secondary-btn"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSignUpClick}
                    className="custom-primary-btn"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* headliner visible only on homepage */}
      {isHomePage && (
        <div className="bg-dark text-center py-1">
          <Container>
            <h2 className="text-light fw-bold">
              Discover and Create Custom Forms
            </h2>
          </Container>
        </div>
      )}

      {/* search bar - visible on every page */}
      <div className={"bg-dark text-center pb-4"}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Form className="d-flex justify-content-center">
                <Form.Control
                  type="text"
                  placeholder="I need a form for..."
                  className="me-2"
                />
                <Button variant="primary" className="custom-primary-btn">
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

export default AppNavBar;
