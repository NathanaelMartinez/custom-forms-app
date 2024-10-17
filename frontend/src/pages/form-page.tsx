// src/components/FormPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTemplateById } from "../services/template-service";
import { Template, Comment } from "../types";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import AppNavBar from "../components/layout/app-nav-bar";
import { useAuth } from "../context/auth-context";
import AppFooter from "../components/layout/app-footer";
import { submitForm } from "../services/form-service";
import RenderQuestion from "../components/forms/render-question";
import CommentSection from "../components/comments/comment-section";
import FormButtons from "../components/forms/form-buttons";

const mockComments = [
  {
    id: "1",
    author: {
      id: "user-1",
      username: "Alice",
      email: "alice@example.com",
      role: "user",
      status: "active",
      createdAt: new Date(),
      templates: [],
    },
    content: "This is a great form!",
    createdAt: new Date(),
  },
  {
    id: "2",
    author: {
      id: "user-2",
      username: "Bob",
      email: "bob@example.com",
      role: "user",
      status: "active",
      createdAt: new Date(),
      templates: [],
    },
    content: "I found it very useful.",
    createdAt: new Date(),
  },
];

type FormResponseValue = string | number | string[];

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formResponses, setFormResponses] = useState<
    Record<string, FormResponseValue>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isCommentSectionVisible, setIsCommentSectionVisible] =
    useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError("No template ID provided.");
      return;
    }

    const getTemplate = async () => {
      try {
        const data = await fetchTemplateById(id as string);
        setTemplate(data);
        // TODO: call fetchComments instead of mock data
        setComments(mockComments);
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
    setFormResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleLikeToggle = () => {
    try {
      setLiked(!liked);
      // await toggleLike(template?.id); TODO: add call to backend to increment like
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(), // tempid
      author: user,
      content: newComment,
      createdAt: new Date(),
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleFormSubmit = async () => {
    if (!user) {
      alert("Please log in to submit the form.");
      return;
    }

    // ensure templateId is defined
    if (!template || !template.id) {
      alert("Template is missing or not fully loaded. Cannot submit form.");
      return;
    }

    console.log("submitting template:", template.id);

    try {
      setIsSubmitting(true);

      // prepare payload for submission
      const responsePayload = {
        templateId: template?.id,
        answers: formResponses,
      };

      console.log("Loaded template with questions: ", template.questions);
      console.log("formResponses:", formResponses); // Ensure question IDs are correct

      await submitForm(responsePayload);

      alert("Form submitted successfully!");
      navigate("/"); // redirect after submission
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <AppNavBar />
      <div className="d-flex flex-grow-1" style={{ minHeight: "100vh" }}>
        {/* Main form content */}
        <div className="flex-grow-1 p-5 d-flex justify-content-center">
          <Card
            className="shadow-lg p-4 bg-white rounded-3"
            style={{ width: "100%", maxWidth: "800px", minHeight: "800px" }}
          >
            <div className="px-5 pt-3">
              {/* alert if user is not logged in */}
              {!user && (
                <Alert variant="warning" className="mb-4">
                  Please log in or sign up to submit this form.
                </Alert>
              )}
              {/* form title */}
              <div
                className="d-flex justify-content-between align-items-center mb-4 pb-2"
                style={{ borderBottom: "2px solid #e0e0e0" }}
              >
                <h1 className="text-dark fs-2 fw-bold">{template?.title}</h1>
                <FormButtons
                  templateId={template?.id || ""}
                  user={user}
                  templateAuthorId={template?.author.id || ""}
                  liked={liked}
                  handleLikeToggle={handleLikeToggle}
                  setIsCommentSectionVisible={setIsCommentSectionVisible}
                  isCommentSectionVisible={isCommentSectionVisible}
                />
              </div>
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
                //  question cards
                <div className="d-flex flex-column gap-3">
                  {template?.questions.map((question) => (
                    <Card
                      key={question.id}
                      className="p-3 shadow-sm border-light custom-card"
                    >
                      <Form.Group controlId={question.id}>
                        <Form.Label className="fs-5 fw-bold text-dark mb-2">
                          {question.questionText}
                        </Form.Label>
                        {/* Replace renderQuestion with RenderQuestion component */}
                        <RenderQuestion
                          question={question}
                          formResponses={formResponses}
                          handleInputChange={handleInputChange}
                        />
                      </Form.Group>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {/* submit Button */}
            <div className="d-flex justify-content-end mt-4 me-5">
              <Button
                variant="primary"
                className="fw-bold custom-success-btn"
                disabled={!user || isSubmitting}
                onClick={handleFormSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Comment Section Column */}
        {isCommentSectionVisible && (<CommentSection
          comments={comments}
          user={user}
          newComment={newComment}
          setNewComment={setNewComment}
          handleCommentSubmit={handleCommentSubmit}
        />)}
      </div>

      <AppFooter />
    </>
  );
};

export default FormPage;
