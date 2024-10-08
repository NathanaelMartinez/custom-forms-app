import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { LockFill, UnlockFill } from "react-bootstrap-icons";
import TagInput from "./tag-input";
import AccessControlModal from "./access-control-modal";

interface TemplateOverviewProps {
  description: string;
  topic: string;
  tags: string[];
  image: File | null;
  onDescriptionChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onTagChange: (tags: string[]) => void;
  onImageUpload: (file: File | null) => void;
  onSave: () => void;
  isSaving: boolean;
  questionsCount: number;
}

const TemplateOverview: React.FC<TemplateOverviewProps> = ({
  description,
  topic,
  tags,
  onDescriptionChange,
  onTopicChange,
  onTagChange,
  onImageUpload,
  onSave,
  isSaving,
  questionsCount,
}) => {
  const [isTopicValid, setIsTopicValid] = useState<boolean>(true);
  const [areQuestionsValid, setAreQuestionsValid] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [exclusiveEmails, setExclusiveEmails] = useState<string[]>([]);

  const handleSave = () => {
    const isTopicSelected = Boolean(topic);
    const hasQuestions = questionsCount > 0;

    setIsTopicValid(isTopicSelected);
    setAreQuestionsValid(hasQuestions);

    if (isTopicSelected && hasQuestions) {
      onSave();
    }
  };

  useEffect(() => {
    // Reset question validation whenever the questions change
    if (questionsCount > 0) {
      setAreQuestionsValid(true);
    }
  }, [questionsCount]);

  useEffect(() => {
    // Reset topic validation when the topic changes
    if (topic) {
      setIsTopicValid(true);
    }
  }, [topic]);

  const handleModalSave = (emails: string[]) => {
    setExclusiveEmails(emails);
  };

  return (
    <div className="bg-white p-4 shadow-sm" style={{ width: "300px" }}>
      <h5 className="mb-3">Template Overview</h5>

      {/* Description input */}
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Describe your template..."
          className="input-focus-muted"
        />
      </Form.Group>

      {/* Topic selection */}
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
        {!isTopicValid && (
          <div className="text-danger mt-1">
            Please select a topic before proceeding.
          </div>
        )}
      </Form.Group>

      {/* Tag input */}
      <Form.Group className="mb-3">
        <Form.Label>Tags</Form.Label>
        <TagInput tags={tags} onTagChange={onTagChange} />
      </Form.Group>

      {/* Image upload */}
      <Form.Group className="mb-3">
        <Form.Label>Top image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0] || null;
            onImageUpload(file);
          }}
        />
      </Form.Group>

      {/* Save button and access control */}
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

      {/* Questions validation */}
      {!areQuestionsValid && (
        <div className="text-danger mt-4">
          Please add at least one question to your template.
        </div>
      )}

      {/* Save button */}
      <Button
        variant="success"
        size="lg"
        className="custom-success-btn mt-4"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Publish"}
      </Button>

      {/* Access Control Modal */}
      <AccessControlModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleModalSave}
        exclusiveEmails={exclusiveEmails}
      />
    </div>
  );
};

export default TemplateOverview;
