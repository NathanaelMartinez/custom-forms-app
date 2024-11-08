// <reference types="vite-plugin-svgr/client" />

import React from "react";
import { Navbar, Nav, Button, Dropdown, Container } from "react-bootstrap";
import {
  ShieldFill,
  PersonLock,
  CardList,
  BoxArrowRight,
  QuestionCircle,
} from "react-bootstrap-icons";
import { useNavigate, useLocation } from "react-router-dom";
import FormNewIcon from "../../assets/icons/form-new.svg?react";
import { useAuth } from "../../context/auth-context";
import AppSearchBar from "./app-search-bar";
import { useSupportModal } from "../../context/support-modal-context";
import { fetchTemplateById } from "../../services/template-service";

const AppNavBar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowSupportModal, setTemplateTitle } = useSupportModal();

  const handleLogInClick = () => {
    navigate("/login", { state: { returnUrl: location.pathname } });
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  const handleReportBugClick = async () => {
    const path = location.pathname;
    const matchForm = path.match(/^\/forms\/([^/]+)$/);

    if (matchForm) {
      const formId = matchForm[1];
      try {
        const form = await fetchTemplateById(formId);
        setTemplateTitle(form.title);
      } catch (error) {
        console.error("Failed to fetch form title:", error);
        setTemplateTitle(""); // clear title if fetch fails
      }
    } else {
      setTemplateTitle(""); // clear title if not on form page
    }
    setShowSupportModal(true); // show modal after setting the title
  };

  const isHomePage = location.pathname === "/"; // for extra features on homepage

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
                  {/* Help button */}
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      as="div" // get rid of arrow
                      className="custom-icon-toggle p-0 me-2"
                      id="help-dropdown"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer", // keep it clickable
                      }}
                    >
                      <QuestionCircle size={36} className="custom-icon-btn" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="/faq">FAQs</Dropdown.Item>
                      <Dropdown.Item href="/support-resources">
                        Support Resources
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleReportBugClick}>
                        Report a bug
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Button
                    variant="link"
                    className="p-0 custom-icon-btn"
                    onClick={() => navigate("/templates")}
                  >
                    <FormNewIcon
                      width={36}
                      height={36}
                      style={{ fill: "white" }}
                    />
                  </Button>

                  {user?.role === "admin" && (
                    <Button
                      variant="link"
                      className="p-0 ms-3 admin-icon-btn"
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
                        // TODO: allow adding of profile pictures
                        <img
                          src={`https://i.pravatar.cc/300?u=${user.username}`}
                          alt="Profile"
                          className="rounded-circle"
                          width="42"
                        />
                      ) : (
                        <PersonLock size={36} />
                      )}
                      <span className="ms-2">{user?.username}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      {/* <Dropdown.Item onClick={() => navigate("/saved-templates")}>
                        Saved Templates
                      </Dropdown.Item> */}
                      <Dropdown.Item
                        onClick={() => navigate(`/profile/${user?.id}`)}
                      >
                        <CardList /> My Dashboard
                      </Dropdown.Item>
                      {user?.role === "admin" && (
                        <Dropdown.Item onClick={() => navigate("/admin-panel")}>
                          <ShieldFill /> Admin Panel
                        </Dropdown.Item>
                      )}
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout} className="text-danger">
                        <BoxArrowRight /> Log Out
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
      <AppSearchBar />
    </>
  );
};

export default AppNavBar;
