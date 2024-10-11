// src/components/FormPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTemplate } from "../services/template-service";
import { Question, Template, Comment } from "../types";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import AppNavBar from "../components/layout/app-nav-bar";
import { useAuth } from "../context/auth-context";
import { Heart, HeartFill, PencilSquare } from "react-bootstrap-icons";
import AppFooter from "../components/layout/app-footer";

type FormResponseValue = string | number | string[];

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formResponses, setFormResponses] = useState<
    Record<string, FormResponseValue>
  >({});
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [liked, setLiked] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const data = await fetchTemplate(id as string);
        setTemplate(data);
        // TODO: call fetchComments instead of mock data
        setComments([
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
        ]);
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

  const handleLikeToggle = () => {
    setLiked(!liked);
    // TODO: add call to backend to increment like
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
              <div className="d-flex align-items-center gap-2">
                {(template?.author.id === user?.id ||
                  user?.role === "admin") && (
                  <Button
                    variant="link"
                    onClick={() => navigate(`/templates/${template?.id}`)}
                    className="custom-contrast-icon-btn"
                  >
                    <PencilSquare size={24} />
                  </Button>
                )}
                {user && template?.author.id !== user?.id && (
                  <Button
                    variant="link"
                    className="custom-contrast-icon-btn"
                    onClick={handleLikeToggle}
                  >
                    {liked ? (
                      <HeartFill size={24} className="text-danger" />
                    ) : (
                      <Heart size={24} className="text-dark" />
                    )}
                  </Button>
                )}
              </div>
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
                      {renderQuestion(
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
          {/* submit Button */}
          <div className="d-flex justify-content-end mt-4 me-5">
            <Button
              variant="primary"
              className="fw-bold custom-success-btn"
              disabled={!user}
            >
              Submit
            </Button>
          </div>
        </Card>
      </div>

      {/* comments Section */}
      <div className="comment-footer p-4 mt-4" style={{ width: "100%" }}>
        <div
          className="bg-white p-4 mt-4 rounded-3 shadow-sm"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <h3 className="fs-4 fw-bold text-dark mb-3">Comments</h3>
          {user ? (
            <Form.Group controlId="newComment" className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Join the conversation..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 input-focus-muted"
              />
              <Button
                variant="secondary"
                className="custom-success-btn"
                onClick={handleCommentSubmit}
              >
                Add Comment
              </Button>
            </Form.Group>
          ) : (
            <Alert variant="info" className="mb-3">
              Please log in to add a comment.
            </Alert>
          )}
          <div className="mt-3">
            {comments.map((comment) => (
              <Card key={comment.id} className="mb-2 p-2 shadow-sm custom-card">
                <Card.Body>
                  <Card.Title className="mb-1 fs-6 fw-bold text-dark">
                    {comment.author?.username}{" "}
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </Card.Title>
                  <Card.Text className="text-dark">{comment.content}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AppFooter />
    </>
  );
};

const renderQuestion = (
  question: Question,
  formResponses: Record<string, FormResponseValue>,
  handleInputChange: (questionId: string, value: FormResponseValue) => void
) => {
  // render form input depending on type
  switch (question.type) {
    case "text":
      return (
        <Form.Control
          type="text"
          value={formResponses[question.id] || ""}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
          className="mt-2 input-focus-muted"
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
          className="mt-2 input-focus-muted"
          placeholder="Write your response"
        />
      );
    case "integer":
      return (
        <Form.Control
          type="number"
          value={formResponses[question.id] || ""}
          onChange={(e) => {
            // regex used to prevent copy/pasting negatives
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
              handleInputChange(question.id, inputValue);
            }
          }}
          className="mt-2 input-focus-muted"
          placeholder="Enter a number"
          min="0"
        />
      );
    case "checkbox":
      return (
        <div className="mt-2">
          {/* have to check if array */}
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
                  // push selected checkboxes to array
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
