import React from "react";
import { Form } from "react-bootstrap";
import { Question } from "../../types";

type FormResponseValue = string | number | string[];

interface RenderQuestionProps {
  question: Question;
  formResponses: Record<string, FormResponseValue>;
  handleInputChange: (questionId: string, value: FormResponseValue) => void;
}

const RenderQuestion: React.FC<RenderQuestionProps> = ({
  question,
  formResponses,
  handleInputChange,
}) => {
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
            const inputValue = e.target.value;
            if (/^\d*$/.test(inputValue)) {
              handleInputChange(question.id, Number(inputValue));
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

export default RenderQuestion;
