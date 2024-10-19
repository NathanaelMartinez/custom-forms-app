// src/components/FormPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAggregateResponses,
  fetchTemplateById,
  submitForm,
} from "../services/template-service";
import { Template, Comment } from "../types";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import AppNavBar from "../components/common/app-nav-bar";
import { useAuth } from "../context/auth-context";
import AppFooter from "../components/common/app-footer";
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

interface NumericData {
  [questionId: string]: {
    questionText: string;
    average?: number;
    min?: number;
    max?: number;
  };
}

interface TextData {
  [questionId: string]: {
    questionText: string;
    counts?: Record<string, number>;
  };
}

interface CheckboxData {
  [questionId: string]: {
    questionText: string;
    optionCounts?: Record<string, number>;
  };
}

interface AggregatedData {
  responseCount: number;
  numericData: NumericData;
  textData: TextData;
  checkboxData: CheckboxData;
}

const FormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formResponses, setFormResponses] = useState<
    Record<string, FormResponseValue>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // track form submission status to display success card
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isCommentSectionVisible, setIsCommentSectionVisible] =
    useState<boolean>(false);
  const [isDataTableVisible, setIsDataTableVisible] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({
    responseCount: 0,
    numericData: {},
    textData: {},
    checkboxData: {},
  });
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

  useEffect(() => {
    const fetchAggregatedData = async () => {
      if (!id) {
        setError("No template ID provided.");
        return;
      }

      if (user?.id !== template?.author?.id && user?.role !== "admin") {
        console.warn(
          "Unauthorized access: You do not have permission to view this data."
        );
        return;
      }
      try {
        const res = await fetchAggregateResponses(id);
        setAggregatedData({
          responseCount: res.responseCount,
          numericData: res.numericData || {},
          textData: res.textData || {},
          checkboxData: res.checkboxData || {},
        });
        console.log("Aggregated Data:", res);
      } catch (error) {
        console.error("Error fetching aggregated data:", error);
      }
    };

    if (isDataTableVisible) {
      fetchAggregatedData();
    }
  }, [isDataTableVisible, id]);

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
      setError("Please log in to submit the form.");
      return;
    }

    // ensure templateId is defined
    if (!template || !template.id) {
      setError("Template is missing or not fully loaded. Cannot submit form.");
      return;
    }

    console.log("submitting template:", template.id);

    setIsSubmitting(true);
    setError(null); // clear any errors

    try {
      // prepare payload for submission
      const responsePayload = {
        templateId: template?.id,
        answers: formResponses,
      };

      console.log("Loaded template with questions: ", template.questions);
      console.log("formResponses:", formResponses); // ensure question IDs are correct

      await submitForm(responsePayload);

      setIsSubmitted(true);
      // scroll back to top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth", // so it doesn't jerk it up
      });
    } catch (error) {
      console.error("Failed to submit form:", error);
      setError("Something went wrong with our servers. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false); // reset submission status
    setFormResponses({}); // clear form responses
    navigate(`/forms/${template?.id}`); // navigate to same form

    // scroll back to top of the page
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  };

  if (error && !template) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <AppNavBar />
      <div className="d-flex flex-grow-1" style={{ minHeight: "100vh" }}>
        {/* form card */}
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
                  setIsDataTableVisible={setIsDataTableVisible}
                  isDataTableVisible={isDataTableVisible}
                />
              </div>
              {isDataTableVisible ? (
                // render data tables
                <div className="text-start">
                  {/* display number of responses */}
                  <h2 className="text-dark mt-5">
                    {aggregatedData.responseCount} Responses
                  </h2>

                  {/* numeric data */}
                  {Object.keys(aggregatedData.numericData || {}).length > 0 && (
                    <div className="table-responsive">
                      <h3 className="text-dark mt-5">Numeric Data</h3>
                      <table className="table table-bordered mt-4">
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Average</th>
                            <th>Min</th>
                            <th>Max</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(aggregatedData.numericData).map(
                            (questionId) => (
                              <tr key={questionId}>
                                <td>
                                  {
                                    aggregatedData.numericData[questionId]
                                      .questionText
                                  }
                                </td>
                                <td>
                                  {aggregatedData.numericData[questionId]
                                    .average ?? "N/A"}
                                </td>
                                <td>
                                  {aggregatedData.numericData[questionId].min ??
                                    "N/A"}
                                </td>
                                <td>
                                  {aggregatedData.numericData[questionId].max ??
                                    "N/A"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* text data */}
                  {Object.keys(aggregatedData.textData || {}).length > 0 && (
                    <div className="table-responsive">
                      <h3 className="text-dark mt-5">Text Responses</h3>
                      <table className="table table-bordered mt-4">
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Text Counts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(aggregatedData.textData).map(
                            (questionId) => (
                              <tr key={questionId}>
                                <td>
                                  {
                                    aggregatedData.textData[questionId]
                                      .questionText
                                  }
                                </td>
                                <td>
                                  {Object.entries(
                                    aggregatedData.textData[questionId]
                                      .counts || {}
                                  ).map(([answer, count]) => (
                                    <p key={answer}>
                                      <strong>{answer}:</strong> {count}
                                    </p>
                                  ))}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* checkbox data */}
                  {Object.keys(aggregatedData.checkboxData || {}).length >
                    0 && (
                    <div className="table-responsive">
                      <h3 className="text-dark mt-5">Checkbox Option Counts</h3>
                      <table className="table table-bordered mt-4">
                        <thead>
                          <tr>
                            <th>Question</th>
                            <th>Option Counts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(aggregatedData.checkboxData).map(
                            (questionId) => (
                              <tr key={questionId}>
                                <td>
                                  {
                                    aggregatedData.checkboxData[questionId]
                                      .questionText
                                  }
                                </td>
                                <td>
                                  {Object.entries(
                                    aggregatedData.checkboxData[questionId]
                                      .optionCounts || {}
                                  ).map(([option, count]) => (
                                    <p key={option}>
                                      <strong>{option}:</strong> {count}
                                    </p>
                                  ))}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : isSubmitted ? (
                // success message
                <div className="text-center">
                  <h2 className="text-dark mt-5">
                    Thank you for your submission!
                  </h2>
                  <p>Your form response was submitted successfully.</p>
                  <Button
                    onClick={handleTryAgain}
                    variant="primary"
                    className="custom-success-btn"
                  >
                    Submit Another Response
                  </Button>
                </div>
              ) : (
                <>
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
                        <Card
                          key={question.id}
                          className="p-3 shadow-sm border-light custom-card"
                        >
                          <Form.Group controlId={question.id}>
                            <Form.Label className="fs-5 fw-bold text-dark mb-2">
                              {question.questionText}
                            </Form.Label>
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
                </>
              )}
            </div>
            {/* display errors */}
            {error && (
              <Alert variant="danger" className="mt-4">
                {error}
              </Alert>
            )}
            {!isSubmitted && !isDataTableVisible && (
              // submit button
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
            )}
          </Card>
        </div>

        {/* comment section column */}
        {isCommentSectionVisible && (
          <CommentSection
            comments={comments}
            user={user}
            newComment={newComment}
            setNewComment={setNewComment}
            handleCommentSubmit={handleCommentSubmit}
          />
        )}
      </div>

      <AppFooter />
    </>
  );
};

export default FormPage;
