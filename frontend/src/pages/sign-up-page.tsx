import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FloatingLabel,
  Alert,
} from "react-bootstrap";
import { FileText } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import gatheringDataImage from "../assets/gathering_data.jpg";
import { registerUser } from "../services/auth-service";
import { useAuth } from "../context/auth-context";

const SignUpPage: React.FC = () => {
  const { login } = useAuth(); // use login from AuthContext to set login state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<string | null>(null); // store error messages

  const navigate = useNavigate();

  // handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null); // reset errors on input change
  };

  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser({ username: formData.username, email: formData.email, password: formData.password });
      
      // save token to localStorage
      localStorage.setItem("authToken", data.token);
      
      // update AuthContext state
      login(data.token);
      
      console.log("User registered successfully", data);
      
      // redirect to the home page after successful registration
      navigate("/");
    } catch (error) {
      setErrors(error as string); // display error to user
    }
  };
  

  return (
    <div className="signup-page bg-dark text-light min-vh-100 d-flex align-items-center">
      <Container>
        {/* Logo */}
        <Row className="mb-5">
          <h1 className="display-3 fw-bold mx-5 text-start">
            <Link to="/" className="text-decoration-none text-light">
              QuickFormr <FileText />
            </Link>
          </h1>
        </Row>

        {/* two sides layout */}
        <Row className="g-0">
          {/* product pitch */}
          <Col
            md={7}
            className="d-flex justify-content-center align-items-center"
          >
            <div className="product-info position-relative bg-secondary p-4 rounded text-center">
              <img
                src={gatheringDataImage}
                alt="Gathering Data"
                className="img-fluid rounded"
              />
              <div className="overlay-text position-absolute bottom-0 start-0 p-4">
                <h2 className="fw-bold">Simplify Form Creation</h2>
                <p>
                  Create custom forms tailored to your goals. Collect the
                  information you need to make better decisions, streamline
                  processes, and get results faster.
                </p>
              </div>
              <a
                href="http://www.freepik.com"
                className="attribution-link position-absolute"
              >
                Designed by studiogstock / Freepik
              </a>
            </div>
          </Col>

          {/* sign-up form */}
          <Col md={4}>
            <div className="form-container p-5 rounded shadow-lg bg-light">
              <h2 className="mb-4 fw-bold text-dark">Sign Up</h2>

              {/* display errors */}
              {errors && <Alert variant="danger">{errors}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formUsername" className="mb-3">
                  <FloatingLabel controlId="floatingUsername" label="Username">
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter username"
                      value={formData.username}
                      onChange={handleChange}
                      className="input-focus-muted"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <FloatingLabel controlId="floatingEmail" label="Email">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-focus-muted"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-focus-muted"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formConfirmPassword" className="mb-4">
                  <FloatingLabel
                    controlId="floatingConfirmPassword"
                    label="Confirm Password"
                  >
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-focus-muted"
                      required
                    />
                  </FloatingLabel>
                </Form.Group>

                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  className="custom-success-btn w-100"
                >
                  Sign Up
                </Button>
              </Form>

              {/* already have an account link */}
              <div className="text-center mt-3">
                <p className="text-dark">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary">
                    Log In Here
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUpPage;
