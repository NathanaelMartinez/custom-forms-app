import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
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
import { uploadImageToCloudinary } from "../services/cloudinary-service";

const CreateTemplatePage: React.FC = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [questionsCount, setQuestionsCount] = useState<number>(0); 
  const { isLoggedIn, user } = useAuth();
  const { templateId } = useParams<{ templateId?: string }>(); 
  const [selectedImage, setSelectedImage] = useState<File | null>(null); 
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); 
  const [exclusiveEmails, setExclusiveEmails] = useState<string[]>([]); 
  const [description, setDescription] = useState<string>(""); // Separate description state
  const [template, setTemplate] = useState<Template>({
    id: "",
    title: "Untitled Form",
    description: "",
    author: user || { id: "" },
    questions: [],
    filledForms: 0,
    likes: 0,
    comments: [],
    topic: "",
    tags: [],
    image: null,
    createdAt: new Date(),
  });
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
          if (
            !user ||
            (templateData.author.id !== user.id && user.role !== "admin")
          ) {
            console.warn(
              "User is not the owner of the document, redirecting to home."
            );
            navigate("/");
          }

          console.log("templateData",templateData);

          setTemplate(templateData);
          setQuestionsCount(templateData.questions.length);
          setDescription(templateData.description || ""); // Set description to the new state
          setImagePreviewUrl(templateData.image!);
        } catch (error) {
          console.error("Failed to fetch template:", error);
        }
      };
      loadTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const savedTemplate = localStorage.getItem("savedTemplate");
    if (savedTemplate) {
      const parsedTemplate = JSON.parse(savedTemplate);
      setTemplate(parsedTemplate);
      setQuestionsCount(parsedTemplate.questions.length);
      setDescription(parsedTemplate.description || ""); // Initialize description state
      localStorage.removeItem("savedTemplate");
    }
  }, []);

  const handleSaveTemplate = async () => {
    if (!isLoggedIn) {
      localStorage.setItem("savedTemplate", JSON.stringify(template));
      navigate("/login", { state: { returnUrl: location.pathname } });
      return;
    }

    try {
      setIsSaving(true);

      if (template.questions.length === 0) {
        setIsSaving(false);
        return;
      }

      const imageUrl = await handleImageUpload();
      const updatedTemplate = { ...template, description, image: imageUrl }; // use separate description state
      const payload = mapTemplateToPayload(updatedTemplate);

      console.log("payload", payload);

      if (templateId) {
        await updateTemplate(templateId, payload);
        navigate(`/forms/${templateId}`);
      } else {
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
    setQuestionsCount((prevCount) => prevCount + 1); 
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
    setQuestionsCount(updatedQuestions.length); 
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicatedQuestion = { ...question, id: `temp-${Date.now()}` };
    setTemplate((prev) => ({
      ...prev,
      questions: [...prev.questions, duplicatedQuestion],
    }));
    setQuestionsCount(template.questions.length + 1); 
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

  const handleImageSelection = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file); 
      setImagePreviewUrl(previewUrl); 
    } else {
      setSelectedImage(null);
      setImagePreviewUrl(null);
    }
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      try {
        const imageUrl = await uploadImageToCloudinary(selectedImage);
        return imageUrl;
      } catch (error) {
        console.error("Image upload failed", error);
        return null;
      }
    }
    return null;
  };

  const handleReorderQuestions = (newQuestions: Question[]) => {
    const newOrder = [...newQuestions];
    setTemplate((prev) => ({
      ...prev,
      questions: newOrder,
    }));
  };

  const handleAddEmail = (emails: string[]) => {
    setExclusiveEmails(emails);
  };

  const handleRemoveEmail = (email: string) => {
    setExclusiveEmails((prevEmails) => prevEmails.filter((e) => e !== email));
  };

  const handleTagChange = (tags: string[]) => {
    const normalizedTags = tags.map((tag) =>
      tag.toLowerCase().replace(/\b(a|an|the)\b/g, "").trim() // normalize tags
    );
    setTemplate((prev) => ({
      ...prev,
      tags: Array.isArray(normalizedTags) ? normalizedTags : [],
    }));
  };

  return (
    <>
      <AppNavBar />
      <div className="d-flex justify-content-center min-vh-100 bg-light">
        <div className="flex-grow-1"></div>
        <div className="flex-grow-1 p-5">
          {imagePreviewUrl && (
            <div className="mb-4 w-100" style={{ maxWidth: "800px" }}>
              <img
                src={imagePreviewUrl}
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
          <Card
            className="shadow-lg p-4 bg-white rounded-3"
            style={{ width: "100%", maxWidth: "800px" }}
          >
            <Form.Control
              type="text"
              value={template.title}
              onChange={(e) =>
                setTemplate({ ...template, title: e.target.value })
              }
              className="fs-3 fw-bold mb-3 text-start border-0 border-bottom input-focus-muted"
              placeholder="Untitled Form"
            />

            <Form.Group className="mb-3">
              <ReactQuill
                value={description} // Use the separate description state
                onChange={setDescription} // Update the description state
                placeholder="Describe your form..."
                className="input-focus-muted"
              />
            </Form.Group>

            <QuestionList
              containerId={template.id}
              questions={template.questions}
              onChange={handleQuestionTextChange}
              onDelete={handleDeleteQuestion}
              onDuplicate={handleDuplicateQuestion}
              onOptionChange={handleOptionChange}
              onAddOption={handleAddOption}
              onToggleDisplayInTable={handleToggleDisplayInTable}
              onReorder={handleReorderQuestions}
            />
            <AddQuestionButton onAddQuestion={handleAddQuestion} />
          </Card>
        </div>
        <TemplateOverview
          description={description || ""}
          topic={template.topic || ""}
          tags={template.tags || []}
          imagePreviewUrl={imagePreviewUrl}
          onTopicChange={(value) => setTemplate({ ...template, topic: value })}
          onTagChange={handleTagChange}
          onImageUpload={handleImageSelection}
          onSave={handleSaveTemplate}
          isSaving={isSaving}
          questionsCount={questionsCount}
          exclusiveEmails={exclusiveEmails}
          onAddEmail={handleAddEmail}
          onRemoveEmail={handleRemoveEmail}
        />
      </div>
    </>
  );
};

export default CreateTemplatePage;
