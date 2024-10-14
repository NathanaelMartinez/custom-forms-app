import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { Question } from "../../types";

interface AddQuestionButtonProps {
  onAddQuestion: (type: Question["type"]) => void;
}

const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ onAddQuestion }) => (
  <DropdownButton
    title={<Plus size={24} />}
    variant="outline-secondary"
    className="rounded-circle mt-2"
    drop="end"
  >
    <Dropdown.Item onClick={() => onAddQuestion("text")}>Short Answer</Dropdown.Item>
    <Dropdown.Item onClick={() => onAddQuestion("textarea")}>Paragraph</Dropdown.Item>
    <Dropdown.Item onClick={() => onAddQuestion("integer")}>Number</Dropdown.Item>
    <Dropdown.Item onClick={() => onAddQuestion("checkbox")}>Checkboxes</Dropdown.Item>
  </DropdownButton>
);

export default AddQuestionButton;
