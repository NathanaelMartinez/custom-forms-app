import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { LockFill, UnlockFill } from "react-bootstrap-icons";
import TagInput from "../forms/tag-input";
import AccessControlModal from "./access-control-modal";

interface TemplateOverviewProps {
  description: string;
  topic: string;
  tags: string[];
  imagePreviewUrl: string | null;
  onTopicChange: (value: string) => void;
  onTagChange: (tags: string[]) => void;
  onImageUpload: (file: File | null) => void;
  onSave: () => void;
  isSaving: boolean;
  questionsCount: number;
  exclusiveEmails: string[];
  onAddEmail: (emails: string[]) => void;
  onRemoveEmail: (email: string) => void;
}

const TemplateOverview: React.FC<TemplateOverviewProps> = ({
  topic,
  tags,
  imagePreviewUrl,
  onTopicChange,
  onTagChange,
  onImageUpload,
  onSave,
  isSaving,
  questionsCount,
  exclusiveEmails,
  onAddEmail,
  onRemoveEmail,
}) => {
  const [isTopicValid, setIsTopicValid] = useState<boolean>(true);
  const [areQuestionsValid, setAreQuestionsValid] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSave = () => {
    const isTopicSelected = Boolean(topic);
    const hasQuestions = questionsCount > 0;

    setIsTopicValid(isTopicSelected);
    setAreQuestionsValid(hasQuestions);

    if (isTopicSelected && hasQuestions) {
      onSave();
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageUpload(file); // this gives file to parent
  };

  const handleSaveEmails = (emails: string[]) => {
    onAddEmail(emails); // Accept the array of emails
  };

  useEffect(() => {
    // if there are questions, there shouldn't be an error
    if (questionsCount > 0) {
      setAreQuestionsValid(true);
    }
  }, [questionsCount]);

  useEffect(() => {
    // if topic is selected, get rid of that error
    if (topic) {
      setIsTopicValid(true);
    }
  }, [topic]);

  return (
    <div className="bg-white p-4 shadow-sm" style={{ width: "300px" }}>
      <h5 className="mb-3">Template Overview</h5>

      {/* topic selector */}
      <Form.Group className="mb-3">
        <Form.Label>Topic</Form.Label>
        <Form.Select
          className={`input-focus-muted ${
            !isTopicValid ? "border-danger" : ""
          }`}
          value={topic}
          onChange={(e) => {
            onTopicChange(e.target.value);
          }}
        >
          <option value="" disabled hidden>
            Select a topic...
          </option>
          <option value="Education">Education</option>
          <option value="Quiz">Quiz</option>
          <option value="Survey">Survey</option>
          <option value="Other">Other</option>
        </Form.Select>
        {/* display error if topic not selected */}
        {!isTopicValid && (
          <div className="text-danger mt-1">
            Please select a topic before proceeding.
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tags</Form.Label>
        <TagInput tags={tags} onTagChange={onTagChange} />
      </Form.Group>

      {/* image preview to demosntrate that img selected */}
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt="Selected preview"
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            marginBottom: "10px",
          }}
        />
      )}

      {/* image upload selector */}
      <Form.Group className="mb-3">
        <Form.Label>Top Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageSelection}
        />
      </Form.Group>

      {/* access control */}
      <Button
        variant="outline-primary"
        className="d-flex align-items-center mt-4 custom-outline-contrast-btn"
        onClick={() => setShowModal(true)}
      >
        {exclusiveEmails.length > 0 ? (
          <>
            <LockFill className="me-2" />
            Private: Only selected users
          </>
        ) : (
          <>
            <UnlockFill className="me-2" />
            Public: Anyone can answer
          </>
        )}
      </Button>

      {/* display error if no questions added */}
      {!areQuestionsValid && (
        <div className="text-danger mt-4">
          Please add at least one question to your template.
        </div>
      )}

      {/* publish button */}
      <Button
        variant="success"
        size="lg"
        className="custom-success-btn mt-4"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Publish"}
      </Button>

      {/* access control modal */}
      <AccessControlModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveEmails} 
        exclusiveEmails={exclusiveEmails}
        onRemoveEmail={onRemoveEmail} 
      />
    </div>
  );
};

export default TemplateOverview;
