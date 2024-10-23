import React, { useEffect, useRef, useState } from "react";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Card, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import {
  ThreeDotsVertical,
  GripVertical,
  Square,
  Copy,
  Trash,
} from "react-bootstrap-icons";
import { Question } from "../../types";

interface QuestionCardProps {
  question: Question;
  onChange: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (question: Question) => void;
  onOptionChange: (id: string, index: number, value: string) => void;
  onAddOption: (id: string) => void;
  onToggleDisplayInTable: (id: string, value: boolean) => void;
  dropTargetProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getData: () => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDragEnter: (args: any) => void;
    onDragLeave: () => void;
    onDrop: () => void;
  };
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onChange,
  onDelete,
  onDuplicate,
  onOptionChange,
  onAddOption,
  onToggleDisplayInTable,
  dropTargetProps, 
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  // make card draggable and set up drop target
  useEffect(() => {
    const element = cardRef.current;
    const handle = handleRef.current;

    // cleanup function
    let cleanup: (() => void) | undefined;

    if (element && handle) {
      // register draggable and store cleanup function
      cleanup = combine(
        draggable({
          element,
          dragHandle: handle, // use grip as drag handle
          getInitialData: () => ({ cardId: question.id }), //attach question ID
          onDragStart: () => setIsDragging(true), // set isDragging to true when dragging starts
          onDrop: () => setIsDragging(false),
        }),
        // set up card as a drop target
        dropTargetForElements({
          element,
          ...dropTargetProps, 
        })
      );
    }

    // cleanup draggable when component is unmounted or re-rendered
    return () => {
      if (cleanup) {
        cleanup(); // unregister draggable
      }
    };
  }, [question.id, dropTargetProps]);

  return (
    <Card
      className={`mb-3 bg-light border-0 rounded-3 position-relative question-card ${isDragging ? 'dragging' : ''}`}
      ref={cardRef}
    >
      <Card.Body>
        <div className="d-flex align-items-start mb-2">
          {/* for dragging */}
          <div className="me-3" style={{ alignSelf: "center", cursor: "grab" }} ref={handleRef}>
            <GripVertical className="text-muted" size={26} />
          </div>
          <div className="flex-grow-1">
            <Form.Control
              type="text"
              placeholder="Enter your question..."
              value={question.questionText}
              onChange={(e) => onChange(question.id, e.target.value)}
              className="mb-2 border-0 border-bottom input-focus-muted"
            />
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
                        onOptionChange(question.id, index, e.target.value)
                      }
                      className="border-0 border-bottom input-focus-muted"
                    />
                  </InputGroup>
                ))}
                <Button
                  variant="outline-secondary"
                  className="custom-outline-secondary-btn"
                  size="sm"
                  onClick={() => onAddOption(question.id)}
                >
                  Add another option
                </Button>
              </div>
            )}
          </div>

          {/* dropdown for options -- delete and duplicate */}
          <div className="ms-3" style={{ alignSelf: "center" }}>
            <Dropdown align="end">
              <Dropdown.Toggle
                as={Button}
                variant="link"
                className="p-0 text-secondary dropdown-toggle-no-caret"
              >
                <ThreeDotsVertical size={26} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onDuplicate(question)}>
                  <Copy /> Duplicate
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => onDelete(question.id)}
                  className="text-danger"
                >
                  <Trash /> Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* toggle switch for displayInTable */}
        <div className="d-flex align-items-center justify-content-start mt-3 ms-5 custom-toggle-switch">
          <Form.Check
            type="switch"
            id={`displayInTable-${question.id}`}
            className="me-2"
            checked={question.displayInTable}
            onChange={(e) =>
              onToggleDisplayInTable(question.id, e.target.checked)
            }
          />
          <Form.Label
            htmlFor={`displayInTable-${question.id}`}
            className="mb-0"
          >
            Display in data table
          </Form.Label>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuestionCard;
