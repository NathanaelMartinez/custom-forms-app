import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import gatheringDataImage from "../assets/gathering_data.jpg";
import { loginUser } from "../services/auth-service";
import { useAuth } from "../context/auth-context";
import ProductPitch from "../components/common/product-pitch";
import AuthForm from "../components/auth/auth-form";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // extract returnUrl if exists
  const returnUrl = location.state?.returnUrl || "/"; // need to whitelist this

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors(null); // reset errors on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("authToken", data.token);
      login(data.token);

      // redirect to returnUrl if exists (defaults to home)
      navigate(returnUrl);
    } catch (error) {
      setErrors(error as string); // display error message to user
    }
  };

  return (
    <div className="login-page bg-dark text-light min-vh-100 d-flex align-items-center">
      <Container>
        <h1 className="display-3 mb-5 fw-bold text-start">
          <Link to="/" className="text-decoration-none text-light">
            QuickFormr
          </Link>
        </h1>

        <Row className="g-0">
          <ProductPitch
            imageSrc={gatheringDataImage}
            title="Manage Your Custom Forms"
            description="Log in to access, manage, and customize your forms. Make smarter decisions with real-time insights and control over your data collection process."
          />
          <Col md={4}>
            <AuthForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
