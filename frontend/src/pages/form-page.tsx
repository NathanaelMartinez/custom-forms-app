// src/components/FormPage.tsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchAggregateResponses,
  fetchTemplateById,
  submitForm,
  toggleLikeTemplate,
} from "../services/template-service";
import { Template, User } from "../types";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import AppNavBar from "../components/common/app-nav-bar";
import { useAuth } from "../context/auth-context";
import AppFooter from "../components/common/app-footer";
import RenderQuestion from "../components/forms/render-question";
import CommentSection from "../components/comments/comment-section";
import FormButtons from "../components/forms/form-buttons";
import { AggregatedData } from "../types";
import AggregatedDataTables from "../components/templates/aggregate-data-tables";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
  const [isSubmitted, setIsSubmitted] = useState(false); // track form submission status to display success card
  const [newComment, setNewComment] = useState<string>("");
  const [isCommentSectionVisible, setIsCommentSectionVisible] =
    useState<boolean>(false);
  const [isDataTableVisible, setIsDataTableVisible] = useState<boolean>(false);
  const [isLiked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState(0);
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
        setLikesCount(data.likesCount); // set initial likes count
        setLiked(data.likedBy.some((u: User) => u.id === user?.id)); // set initial liked status
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

  const handleToggleLike = async () => {
    if (!template || !user) {
      console.error("Template or User not found.");
      return;
    }
  
    // optimistically toggle like
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;
  
    setLiked(newLikedState);
    setLikesCount(newLikesCount);
  
    try {
      const response = await toggleLikeTemplate(template.id);
  
      // validate likes count and liked state w/ response
      const actualLikedState = response.hasLiked ?? newLikedState;
      const actualLikesCount = response.likesCount ?? newLikesCount;
  
      // update based on server response
      setLiked(actualLikedState);
      setLikesCount(actualLikesCount);
  
    } catch (error) {
      console.error("Failed to toggle like:", error);
  
      // rollback optimistic changes if request fails
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevCount) => (newLikedState ? prevCount - 1 : prevCount + 1));
    }
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
      <div className="d-flex flex-column min-vh-100 bg-light">
        <AppNavBar />

        <div className="d-flex justify-content-center flex-grow-1">
          {/* Main content (image and form card) */}
          <div
            className="d-flex flex-column align-items-center p-5 w-100"
            style={{ maxWidth: "1200px" }}
          >
            {/* Image Preview */}
            {template?.image && (
              <div className="w-100 mb-4" style={{ maxWidth: "800px" }}>
                <img
                  src={template.image}
                  alt="Form banner image"
                  className="img-fluid rounded"
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}

            {/* Form card */}
            <Card
              className="shadow-lg p-4 bg-white rounded-3"
              style={{ width: "100%", maxWidth: "800px", minHeight: "800px" }}
            >
              <div className="px-5 pt-3">
                {/* Alert if user is not logged in */}
                {!user && (
                  <Alert variant="warning" className="mb-4">
                    Please log in or sign up to submit this form.
                  </Alert>
                )}

                {/* Form title */}
                <div
                  className="d-flex justify-content-between align-items-center mb-4 pb-2"
                  style={{ borderBottom: "2px solid #e0e0e0" }}
                >
                  <h1 className="text-dark fs-2 fw-bold">{template?.title}</h1>
                  <FormButtons
                    templateId={template?.id || ""}
                    user={user}
                    templateAuthorId={template?.author.id || ""}
                    liked={isLiked}
                    handleLikeToggle={handleToggleLike}
                    setIsCommentSectionVisible={setIsCommentSectionVisible}
                    isCommentSectionVisible={isCommentSectionVisible}
                    setIsDataTableVisible={setIsDataTableVisible}
                    isDataTableVisible={isDataTableVisible}
                    likesCount={likesCount}
                  />
                </div>

                {/* Form content */}
                {isDataTableVisible ? (
                  <AggregatedDataTables aggregatedData={aggregatedData} />
                ) : isSubmitted ? (
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
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {template?.description || "No description provided."}
                    </ReactMarkdown>

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

              {/* Display errors */}
              {error && (
                <Alert variant="danger" className="mt-4">
                  {error}
                </Alert>
              )}

              {!isSubmitted && !isDataTableVisible && (
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

          {/* Comment section column */}
          {id && isCommentSectionVisible && (
            <CommentSection
              templateId={id}
              user={user}
              newComment={newComment}
              setNewComment={setNewComment}
            />
          )}
        </div>

        <AppFooter />
      </div>
    </>
  );
};

export default FormPage;
