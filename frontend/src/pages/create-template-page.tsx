import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useAuth } from "../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import AppNavBar from "../components/common/app-nav-bar";
import QuestionList from "../components/templates/question-list";
import TemplateOverview from "../components/templates/template-overview";
import AddQuestionButton from "../components/templates/add-question-button";
import { Question, Template } from "../types";

import {
  createTemplate,
  fetchTemplateById,
  updateTemplate,
} from "../services/template-service";
import { mapTemplateToPayload } from "../dtos/template-payload";

const CreateTemplatePage: React.FC = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [questionsCount, setQuestionsCount] = useState<number>(0); // track number of questions for validation
  const { isLoggedIn, user } = useAuth();
  const { templateId } = useParams<{ templateId?: string }>(); // fetch templateId from URL if exists
  const navigate = useNavigate();

  // redirect to login on component mount if user is not defined (just in case)
  useEffect(() => {
    if (!user) {
      console.warn("User is not defined, redirecting to login.");
      navigate("/login", { state: { returnUrl: location.pathname } });
    }

    // fetch the existing template if in "edit" mode
    if (templateId) {
      const loadTemplate = async () => {
        try {
          const templateData: Template = await fetchTemplateById(templateId);
          if (!user || templateData.author.id !== user.id && user.role !== "admin") {
            console.warn(
              "User is not the owner of the document, redirecting to home."
            );
            navigate("/");
          }

          setTemplate(templateData);
          setQuestionsCount(templateData.questions.length);
        } catch (error) {
          console.error("Failed to fetch template:", error);
        }
      };
      loadTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    window.scrollTo(0, 0); // make sure scrolled up
  }, []);

  // get template from storage if redirected from login
  useEffect(() => {
    const savedTemplate = localStorage.getItem("savedTemplate");
    if (savedTemplate) {
      setTemplate(JSON.parse(savedTemplate));
      setQuestionsCount(JSON.parse(savedTemplate).questions.length);
      localStorage.removeItem("savedTemplate"); // clear it after restoring
    }
  }, []);

  const [template, setTemplate] = useState<Template>({
    id: "",
    title: "Untitled Form",
    description: "",
    author: user || { id: "" }, // ensure author is not null
    questions: [],
    filledForms: 0,
    likes: 0,
    comments: [],
    topic: "",
    tags: [],
    image: null,
    createdAt: new Date(),
  });

  const handleSaveTemplate = async () => {
    // check if still logged in (tokens can expire)
    if (!isLoggedIn) {
      // save current state in localStorage
      localStorage.setItem("savedTemplate", JSON.stringify(template));

      // redirect to login page and include a return URL to bring the user back
      navigate("/login", { state: { returnUrl: location.pathname } });
      return;
    }

    try {
      setIsSaving(true);
      const payload = mapTemplateToPayload(template);
      console.log("payload",payload); //TODO: remove DEBUG comments

      if (templateId) {
        // if templateId exists update existing template
        await updateTemplate(templateId, payload);
        navigate(`/forms/${templateId}`);
      } else {
        // Create a new template
        const response = await createTemplate(payload);
        navigate(`/forms/${response.data.template.id}`);
      }
    } catch (error) {
      console.error("Failed to save template:", error);
      alert("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: `temp-${Date.now()}`,
      type,
      questionText: "New Question",
      options: type === "checkbox" ? ["Option 1"] : undefined,
      template,
      displayInTable: true,
    };
    setTemplate((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    setQuestionsCount((prevCount) => prevCount + 1); // increment questions count
  };

  const handleQuestionTextChange = (id: string, text: string) => {
    const updatedQuestions = template.questions.map((q) =>
      q.id === id ? { ...q, questionText: text } : q
    );
    setTemplate({ ...template, questions: updatedQuestions });
  };

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = template.questions.filter((q) => q.id !== id);
    setTemplate({ ...template, questions: updatedQuestions });
    setQuestionsCount(updatedQuestions.length); // update questions count
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicatedQuestion = { ...question, id: `temp-${Date.now()}` };
    setTemplate((prev) => ({
      ...prev,
      questions: [...prev.questions, duplicatedQuestion],
    }));
    setQuestionsCount(template.questions.length + 1); // update the question count
  };

  const handleOptionChange = (id: string, index: number, value: string) => {
    const updatedQuestions = template.questions.map((q) => {
      if (q.id === id && q.options) {
        const updatedOptions = [...q.options];
        updatedOptions[index] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    });

    setTemplate({ ...template, questions: updatedQuestions });
  };

  const handleAddOption = (id: string) => {
    const updatedQuestions = template.questions.map((q) => {
      if (q.id === id && q.options) {
        return {
          ...q,
          options: [...q.options, `Option ${q.options.length + 1}`],
        };
      }
      return q;
    });

    setTemplate({ ...template, questions: updatedQuestions });
  };

  const handleToggleDisplayInTable = (id: string, value: boolean) => {
    const updatedQuestions = template.questions.map((q) =>
      q.id === id ? { ...q, displayInTable: value } : q
    );
    setTemplate({ ...template, questions: updatedQuestions });
  };

  return (
    <>
      <AppNavBar />
      <div className="d-flex min-vh-100 bg-light">
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
              className="fs-3 fw-bold mb-3 text-start border-0 border-bottom input-focus-muted"
              placeholder="Untitled Form"
            />

            {/* description input */}
            <Form.Group className="mb-3">
              {/* <Form.Label>Description</Form.Label> */}
              <Form.Control
                as="textarea"
                rows={3}
                value={template.description}
                onChange={(e) =>
                  setTemplate({ ...template, description: e.target.value })
                }
                placeholder="Describe your form..."
                className="input-focus-muted"
              />
            </Form.Group>

            {/* question list */}
            <QuestionList
              questions={template.questions}
              onChange={handleQuestionTextChange}
              onDelete={handleDeleteQuestion}
              onDuplicate={handleDuplicateQuestion}
              onOptionChange={handleOptionChange}
              onAddOption={handleAddOption}
              onToggleDisplayInTable={handleToggleDisplayInTable}
            />
            <AddQuestionButton onAddQuestion={handleAddQuestion} />
          </Card>
        </div>
        <TemplateOverview
          description={template.description || ""}
          topic={template.topic || ""}
          tags={template.tags || []}
          image={template.image || null}
          onTopicChange={(value) => setTemplate({ ...template, topic: value })}
          onTagChange={(tags) => setTemplate({ ...template, tags })}
          onImageUpload={(image) => setTemplate({ ...template, image })}
          onSave={handleSaveTemplate}
          isSaving={isSaving}
          questionsCount={questionsCount}
        />
      </div>
    </>
  );
};

export default CreateTemplatePage;
