import React from 'react';
import { Navbar, Nav, Button, Dropdown, Container } from 'react-bootstrap';
import { BookmarkFill, PersonCircle, ShieldFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

const AppNavBar: React.FC = () => {
  const { isLoggedIn, username, role, logout } = useAuth(); // use auth context
  const navigate = useNavigate();

  const handleLogInClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/sign-up');
  };

  return (
    <Navbar bg="dark" expand="lg" className="mb-0">
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-2 d-flex align-items-center">
          QuickFormr
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                {/* Saved templates icon */}
                <Button variant="link" className="p-0 me-2 custom-icon-btn" onClick={() => navigate('/saved-templates')}>
                  <BookmarkFill size={36} />
                </Button>

                {/* Admin panel icon (visible if user is admin) */}
                {role === 'admin' && (
                  <Button variant="link" className="p-0 me-2 admin-icon-btn" onClick={() => navigate('/admin-panel')}>
                    <ShieldFill size={36} />
                  </Button>
                )}

                <Dropdown>
                  <Dropdown.Toggle variant="link" id="profile-dropdown" className="d-flex align-items-center custom-icon-btn">
                    {/* Profile icon */}
                    <PersonCircle size={36} />
                    <div className="ms-2 text-light">{username}</div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => navigate('/account')}>Account</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/saved-templates')}>Saved Templates</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout} className="text-danger">
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={handleLogInClick} className="me-2 custom-secondary-btn">
                  Login
                </Button>
                <Button variant="primary" onClick={handleSignUpClick} className="custom-primary-btn">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavBar;
