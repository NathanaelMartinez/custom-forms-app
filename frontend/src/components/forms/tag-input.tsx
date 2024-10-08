import React, { useState } from "react";
import { Form, InputGroup, Button, Badge } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";

interface TagInputProps {
  tags: string[];
  onTagChange: (tags: string[]) => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagChange }) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagChange([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    onTagChange(updatedTags);
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          className="input-focus-muted"
          placeholder="Enter a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
        />
        <Button variant="outline-primary" className="custom-outline-primary-btn" onClick={handleAddTag}>
          <Plus />
        </Button>
      </InputGroup>
      <div className="mt-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            pill
            bg="secondary"
            className="me-1 mb-1"
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            {tag}
            <Button
              variant="link"
              size="sm"
              className="ms-2 p-0 text-white"
              onClick={() => handleRemoveTag(tag)}
              style={{ textDecoration: "none" }}
            >
              &times;
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
