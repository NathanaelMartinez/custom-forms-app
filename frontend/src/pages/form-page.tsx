// src/components/FormPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTemplate } from "../services/template-service";
import { Question, Template } from "../types";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import AppNavBar from "../components/layout/app-nav-bar";
import { useAuth } from "../context/auth-context";
import { PencilSquare } from "react-bootstrap-icons";

type FormResponseValue = string | number | string[];

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formResponses, setFormResponses] = useState<
    Record<string, FormResponseValue>
  >({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const data = await fetchTemplate(id as string);
        setTemplate(data);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch template");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getTemplate();
    }
  }, [id]);

  const handleInputChange = (questionId: string, value: FormResponseValue) => {
    setFormResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <AppNavBar />
      <div className="flex-grow-1 p-5 d-flex justify-content-center">
        {/* big form card */}
        <Card
          className="shadow-lg p-4 bg-white rounded-3"
          style={{ width: "100%", maxWidth: "800px", minHeight: "800px" }}
        >
          <div className="px-5 pt-3">
            {/* form title */}
            <h1
              className="text-dark fs-2 fw-bold mb-4 pb-2"
              style={{
                borderBottom: "2px solid #e0e0e0",
              }}
            >
              {template?.title}
            </h1>
            {/* edit button */}
            {(template?.author.id === user?.id || user?.role === "admin") && (
              <Button
                variant="link"
                onClick={() => navigate(`/templates/${template?.id}`)}
                className="position-absolute custom-contrast-icon-btn"
                style={{ top: "2rem", right: "3rem" }}
              >
                <PencilSquare size={36} />
              </Button>
            )}
            {/* description */}
            <p
              className="text-muted fs-5 fw-normal mb-4"
              style={{ fontStyle: "italic" }}
            >
              {template?.description || "No description provided."}
            </p>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="d-flex flex-column gap-3">
                {template?.questions.map((question) => (
                  <Card key={question.id} className="p-3 shadow-sm border-light">
                    <Form.Group controlId={question.id}>
                      <Form.Label className="fs-5 fw-bold text-dark mb-2">
                        {question.questionText}
                      </Form.Label>
                      {renderInputField(
                        question,
                        formResponses,
                        handleInputChange
                      )}
                    </Form.Group>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

const renderInputField = (
  question: Question,
  formResponses: Record<string, FormResponseValue>,
  handleInputChange: (questionId: string, value: FormResponseValue) => void
) => {
  switch (question.type) {
    case "text":
      return (
        <Form.Control
          type="text"
          value={formResponses[question.id] || ""}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          className="mt-2"
          placeholder="Enter your answer"
        />
      );
    case "textarea":
      return (
        <Form.Control
          as="textarea"
          rows={4}
          value={formResponses[question.id] || ""}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          className="mt-2"
          placeholder="Write your response"
        />
      );
    case "integer":
      return (
        <Form.Control
          type="number"
          value={formResponses[question.id] || ""}
          onChange={(e) => {
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
              handleInputChange(question.id, inputValue);
            }
          }}
          className="mt-2"
          placeholder="Enter a number"
          min="0"
        />
      );
    case "checkbox":
      return (
        <div className="mt-2">
          {Array.isArray(question.options) &&
            question.options.map((option) => (
              <Form.Check
                key={option}
                type="checkbox"
                label={option}
                className="text-dark ms-3"
                checked={
                  Array.isArray(formResponses[question.id]) &&
                  (formResponses[question.id] as string[]).includes(option)
                }
                onChange={(e) => {
                  const updatedValues = Array.isArray(
                    formResponses[question.id]
                  )
                    ? [...(formResponses[question.id] as string[])]
                    : [];
                  if (e.target.checked) {
                    updatedValues.push(option);
                  } else {
                    const index = updatedValues.indexOf(option);
                    if (index > -1) {
                      updatedValues.splice(index, 1);
                    }
                  }
                  handleInputChange(question.id, updatedValues);
                }}
              />
            ))}
        </div>
      );
    default:
      return null;
  }
};

export default FormPage;
