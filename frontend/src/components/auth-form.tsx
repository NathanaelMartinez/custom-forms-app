import React from "react";
import { Form, Button, FloatingLabel, Alert } from "react-bootstrap";

interface AuthFormProps {
  formData: {
    email: string;
    password: string;
    username?: string;
    confirmPassword?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  errors: string | null;
  isSignUp?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
  isSignUp = false,
}) => {
  return (
    <div className="form-container p-5 rounded shadow-lg bg-light">
      <h2 className="mb-4 fw-bold text-dark">{isSignUp ? "Sign Up" : "Log In"}</h2>

      {/* Display errors */}
      {errors && <Alert variant="danger">{errors}</Alert>}

      <Form onSubmit={handleSubmit}>
        {isSignUp && (
          <Form.Group controlId="formUsername" className="mb-3">
            <FloatingLabel controlId="floatingUsername" label="Username">
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username || ""}
                onChange={handleChange}
                className="input-focus-muted"
                required
              />
            </FloatingLabel>
          </Form.Group>
        )}

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

        {isSignUp && (
          <Form.Group controlId="formConfirmPassword" className="mb-4">
            <FloatingLabel controlId="floatingConfirmPassword" label="Confirm Password">
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword || ""}
                onChange={handleChange}
                className="input-focus-muted"
                required
              />
            </FloatingLabel>
          </Form.Group>
        )}

        <Button variant="success" type="submit" size="lg" className="custom-success-btn w-100">
          {isSignUp ? "Sign Up" : "Log In"}
        </Button>
      </Form>

      {/* Conditional links for login/sign-up */}
      <div className="text-center mt-3">
        {isSignUp ? (
          <p className="text-dark">
            Already have an account? <a href="/login" className="text-primary">Log In Here</a>
          </p>
        ) : (
          <p className="text-dark">
            Don't have an account? <a href="/sign-up" className="text-primary">Sign Up Here</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
