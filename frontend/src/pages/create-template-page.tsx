import React, { useEffect, useState } from "react";
import {
  Form,
  Card,
  Dropdown,
  InputGroup,
  Button,
  DropdownButton,
} from "react-bootstrap";
import {
  Plus,
  ThreeDotsVertical,
  GripVertical,
  Square,
  LockFill,
} from "react-bootstrap-icons";
import AppNavBar from "../components/app-nav-bar";
import { Question, Template, User } from "../types";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import { createTemplate } from "../services/template-service";

const CreateTemplatePage: React.FC = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // initialize template state with current user
  const [template, setTemplate] = useState<Template>({
    id: "",
    title: "New Template",
    description: "",
    author: user as User, // directly use the user object as author
    questions: [],
    createdAt: new Date(),
    filledForms: 0,
    likes: 0,
    comments: [],
  });

  const handleSaveTemplate = async () => {
    try {
      setIsSaving(true);

      // define the payload with updated structure
      const payload = {
        title: template.title,
        description: template.description || "",
        authorId: template.author.id,
        topic: template.topic || "", // TODO: ensure a topic is selected before submission
        questions: template.questions.map(
          ({ type, questionText, options }) => ({
            type,
            questionText, // use questionText instead of title
            options, // include options if they exist (for checkboxes)
          })
        ),
      };

      console.log("Payload to be sent:", payload);

      // send the request to the backend using your template service
      const response = await createTemplate(payload);

      // handle successful response
      console.log("Template saved successfully:", response.data);
      navigate(`/template/${response.data.id}`);
    } catch (error) {
      console.error("Failed to save template:", error);
      alert("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // adds a new question of specified type
  const handleAddQuestion = (type: Question["type"]) => {
    const tempId = `temp-${Date.now()}`;
    const newQuestion: Question = {
      id: tempId,
      type,
      questionText: "New Question", // set a default question text
      options: type === "checkbox" ? ["Option 1"] : undefined,
      template,
      displayInTable: true,
    };
    const updatedQuestions = [...template.questions, newQuestion];
    setTemplate({ ...template, questions: updatedQuestions });
  };

  // updates the question text as user types
  const handleQuestionTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionId: string
  ) => {
    const updatedQuestions = template.questions.map((question) =>
      question.id === questionId
        ? { ...question, questionText: e.currentTarget.value }
        : question
    );
    setTemplate({ ...template, questions: updatedQuestions });
  };

  // removes a question by id
  const handleDeleteQuestion = (questionId: string) => {
    const updatedQuestions = template.questions.filter(
      (question) => question.id !== questionId
    );
    setTemplate({ ...template, questions: updatedQuestions });
  };

  // duplicates a question and gives it a new id
  const handleDuplicateQuestion = (question: Question) => {
    const duplicatedQuestion = {
      ...question,
      id: "",
    };
    const updatedQuestions = [...template.questions, duplicatedQuestion];
    setTemplate({ ...template, questions: updatedQuestions });
  };

  // updates options for checkbox questions
  const handleCheckboxOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionId: string,
    optionIndex: number
  ) => {
    const updatedQuestions = template.questions.map((question) => {
      if (question.id === questionId && question.options) {
        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = e.target.value;
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setTemplate({ ...template, questions: updatedQuestions });
  };

  // adds a new option to a checkbox question
  const handleAddCheckboxOption = (questionId: string) => {
    const updatedQuestions = template.questions.map((question) => {
      if (question.id === questionId && question.options) {
        return {
          ...question,
          options: [
            ...question.options,
            `Option ${question.options.length + 1}`,
          ],
        };
      }
      return question;
    });
    setTemplate({ ...template, questions: updatedQuestions });
  };

  //   const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const inputValue = e.target.value;
  //     TODO: tag suggestions
  //   };

  return (
    <>
      <AppNavBar />
      <div className="d-flex min-vh-100 bg-light">
        {/* left side: template form */}
        <div className="flex-grow-1 p-5 d-flex justify-content-center">
          <Card
            className="shadow-lg p-4 bg-white rounded-3"
            style={{ width: "100%", maxWidth: "800px" }}
          >
            {/* title input */}
            <Form.Control
              type="text"
              value={template.title}
              onChange={(e) =>
                setTemplate({ ...template, title: e.target.value })
              }
              className="fs-3 fw-bold mb-4 text-start border-0 border-bottom input-focus-muted"
              placeholder="New Template"
            />

            {/* questions list */}
            {template.questions.map((question) => (
              <Card
                key={question.id}
                className="mb-3 bg-light border-0 rounded-3 position-relative"
              >
                <Card.Body className="d-flex align-items-center">
                  {/* grip icon for drag-and-drop */}
                  <div className="me-3 d-flex align-items-center">
                    <GripVertical className="text-muted" size={26} />
                  </div>
                  <div className="flex-grow-1">
                    {/* question text input */}
                    <Form.Control
                      type="text"
                      placeholder="Enter your question..."
                      value={question.questionText}
                      onChange={(e) => handleQuestionTextChange(e, question.id)}
                      className="mb-2 border-0 border-bottom input-focus-muted"
                    />

                    {/* input preview based on question type */}
                    {question.type === "text" && (
                      <Form.Control
                        type="text"
                        placeholder="Short answer..."
                        className="border-0 border-bottom input-focus-muted"
                        readOnly
                      />
                    )}
                    {question.type === "textarea" && (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Long answer..."
                        className="border-0 input-focus-muted"
                        readOnly
                      />
                    )}
                    {question.type === "integer" && (
                      <Form.Control
                        type="number"
                        placeholder="Number answer..."
                        className="border-0 border-bottom input-focus-muted"
                        readOnly
                      />
                    )}
                    {question.type === "checkbox" && (
                      <div>
                        {question.options?.map((option, index) => (
                          <InputGroup key={index} className="mb-2">
                            <InputGroup.Text>
                              <Square className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                              type="text"
                              value={option}
                              onChange={(e) =>
                                handleCheckboxOptionChange(
                                  e,
                                  question.id,
                                  index
                                )
                              }
                              className="border-0 border-bottom input-focus-muted"
                            />
                          </InputGroup>
                        ))}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleAddCheckboxOption(question.id)}
                        >
                          Add another option
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* dropdown menu for duplicate/delete */}
                  <Dropdown align="start">
                    <Dropdown.Toggle
                      as={Button}
                      variant="link"
                      className="p-0 d-flex align-items-center dropdown-toggle-no-caret text-secondary"
                    >
                      <ThreeDotsVertical size={26} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handleDuplicateQuestion(question)}
                      >
                        Duplicate
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-danger"
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Body>
              </Card>
            ))}

            {/* add question button */}
            <div className="d-flex justify-content-start mt-4">
              <DropdownButton
                title={<Plus size={24} />}
                variant="outline-secondary"
                className="rounded-circle"
                drop="end"
              >
                <Dropdown.Item onClick={() => handleAddQuestion("text")}>
                  Short Answer
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddQuestion("textarea")}>
                  Paragraph
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddQuestion("integer")}>
                  Number
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleAddQuestion("checkbox")}>
                  Checkboxes
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </Card>
        </div>

        {/* right side: template overview toolbar */}
        <div className="bg-white p-4 shadow-sm" style={{ width: "300px" }}>
          <h5 className="mb-3">Template Overview</h5>

          {/* description input */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={template.description}
              onChange={(e) =>
                setTemplate({ ...template, description: e.target.value })
              }
              placeholder="Describe your template..."
              className="input-focus-muted"
            />
          </Form.Group>

          {/* topic selection */}
          <Form.Group className="mb-3">
            <Form.Label>Topic</Form.Label>
            <Form.Select
              className="input-focus-muted"
              value={template.topic || ""}
              onChange={(e) =>
                setTemplate({ ...template, topic: e.target.value })
              }
            >
              <option value="" disabled hidden>
                Select a topic...
              </option>
              <option value="Education">Education</option>
              <option value="Quiz">Quiz</option>
              <option value="Survey">Survey</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          {/* tag input */}
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Enter tags..."
                className="input-focus-muted"
                // onChange={handleTagInputChange}
              />
            </InputGroup>
          </Form.Group>

          {/* image upload */}
          <Form.Group className="mb-3">
            <Form.Label>Top image</Form.Label>
            <Form.Control type="file" accept="image/*" />
          </Form.Group>

          {/* public or invite only */}
          <div className="mt-4 d-flex align-items-center">
            <LockFill className="me-2 text-muted" />
            <span>Public: Answerable by all users</span>
          </div>

          <Button
            variant="primary"
            className="mt-3 custom-success-btn"
            onClick={handleSaveTemplate}
            disabled={isSaving} // Optional: disable while saving
          >
            {isSaving ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateTemplatePage;
