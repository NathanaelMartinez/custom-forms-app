import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import gatheringDataImage from "../assets/gathering_data.jpg";
import { registerUser } from "../services/auth-service";
import { useAuth } from "../context/auth-context";
import ProductPitch from "../components/common/product-pitch";
import AuthForm from "../components/auth/auth-form";

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
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

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
          <h1 className="display-3 mb-5 fw-bold text-start">
            <Link to="/" className="text-decoration-none text-light">
              QuickFormr
            </Link>
          </h1>
        {/* two sides layout */}
        <Row className="g-0">
          <ProductPitch
            imageSrc={gatheringDataImage}
            title="Simplify Form Creation"
            description="Create custom forms tailored to your goals. Collect the
                    information you need to make better decisions, streamline
                    processes, and get results faster."
          />

          {/* sign-up form */}
          <Col md={4}>
            <AuthForm
              formData={formData} // Includes username, email, password
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              errors={errors}
              isSignUp // This prop differentiates login and sign-up forms
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUpPage;
