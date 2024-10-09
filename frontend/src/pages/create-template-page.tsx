import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useAuth } from "../context/auth-context";
import { useNavigate } from "react-router-dom";
import AppNavBar from "../components/layout/app-nav-bar";
import QuestionList from "../components/forms/question-list";
import TemplateOverview from "../components/forms/template-overview";
import AddQuestionButton from "../components/forms/add-question-button";
import { Question, Template, User } from "../types";
import { createTemplate } from "../services/template-service";

const CreateTemplatePage: React.FC = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [questionsCount, setQuestionsCount] = useState<number>(0); // track number of questions for validation
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

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
    author: user as User,
    questions: [],
    createdAt: new Date(),
    filledForms: 0,
    likes: 0,
    comments: [],
    tags: [],
    image: null,
  });

  const handleSaveTemplate = async () => {
    // check if still logged in (tokens can expire)
    if (!isLoggedIn) {
      // save current state in localStorage
      localStorage.setItem("savedTemplate", JSON.stringify(template));

      // redirect to login page and include a return URL to bring the user back
      navigate("/login", { state: { returnUrl: "/create-template" } });
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title: template.title,
        description: template.description || "",
        authorId: template.author.id,
        topic: template.topic || "",
        questions: template.questions.map(
          ({ type, questionText, options }) => ({
            type,
            questionText,
            options,
          })
        ),
        tags: template.tags,
        image: template.image,
      };
      const response = await createTemplate(payload);
      navigate(`/template/${response.data.id}`);
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
              className="fs-3 fw-bold mb-4 text-start border-0 border-bottom input-focus-muted"
              placeholder="Untitled Form"
            />

            {/* question list */}
            <QuestionList
              questions={template.questions}
              onChange={handleQuestionTextChange}
              onDelete={handleDeleteQuestion}
              onDuplicate={handleDuplicateQuestion}
              onOptionChange={handleOptionChange}
              onAddOption={handleAddOption}
            />
            <AddQuestionButton onAddQuestion={handleAddQuestion} />
          </Card>
        </div>
        <TemplateOverview
          description={template.description || ""}
          topic={template.topic || ""}
          tags={template.tags || []}
          image={template.image || null}
          onDescriptionChange={(value) =>
            setTemplate({ ...template, description: value })
          }
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
