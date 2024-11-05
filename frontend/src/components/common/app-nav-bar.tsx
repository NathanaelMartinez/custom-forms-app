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

const AppNavBar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowSupportModal } = useSupportModal();

  const handleLogInClick = () => {
    navigate("/login", { state: { returnUrl: location.pathname } });
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
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
              <Dropdown align="end">
                <Dropdown.Toggle
                  as={Button}
                  variant="link"
                  className="p-0 me-2 custom-icon-btn"
                  id="help-dropdown"
                >
                  <QuestionCircle size={36} className="text-light" />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="/faq">FAQs</Dropdown.Item>
                  <Dropdown.Item href="/documentation">
                    Documentation
                  </Dropdown.Item>
                  <Dropdown.Item href="/support-resources">
                    Support Resources
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => setShowSupportModal(true)}>
                    Still need help? Contact Support
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {isLoggedIn ? (
                <>
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
