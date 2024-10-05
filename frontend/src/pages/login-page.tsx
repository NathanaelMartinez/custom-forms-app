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
import axios, { AxiosError } from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<string | null>(null); // store error messages

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null); // reset errors on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // make request to backend
      const response = await axios.post(`${SERVER_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      // handle successful login
      const authToken = response.data.token;
      localStorage.setItem("authToken", authToken); // save token to localStorage
      console.log("User logged in successfully", response.data);
      navigate("/"); // redirect to home after successful login

    } catch (error) {
      // handle error messages
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<{ error: string }>;
        const message = err.response?.data?.error || "Login failed";
        setErrors(message);  // display error message to user
      } else {
        setErrors("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-page bg-dark text-light min-vh-100 d-flex align-items-center">
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
                <h2 className="fw-bold">Manage Your Custom Forms</h2>
                <p>
                  Log in to access, manage, and customize your forms. Make
                  smarter decisions with real-time insights and control over
                  your data collection process.
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

          {/* login form */}
          <Col md={4}>
            <div className="form-container p-5 rounded shadow-lg bg-light">
              <h2 className="mb-4 fw-bold text-dark">Log In</h2>

              {/* display errors */}
              {errors && <Alert variant="danger">{errors}</Alert>}

              <Form onSubmit={handleSubmit}>
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

                <Form.Group controlId="formPassword" className="mb-4">
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

                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  className="custom-success-btn w-100"
                >
                  Log In
                </Button>
              </Form>

              {/* don't have an account link */}
              <div className="text-center mt-3">
                <p className="text-dark">
                  Don't have an account?{" "}
                  <Link to="/sign-up" className="text-primary">
                    Sign Up Here
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

export default LoginPage;
