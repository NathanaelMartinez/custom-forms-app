// access-control-modal.tsx
import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EnvelopePlusFill } from "react-bootstrap-icons";

interface AccessControlModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (emails: string[]) => void;
  exclusiveEmails: string[];
}

const AccessControlModal: React.FC<AccessControlModalProps> = ({
  show,
  onClose,
  onSave,
  exclusiveEmails,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [emails, setEmails] = useState<string[]>(exclusiveEmails);

  const handleAddEmail = () => {
    const trimmedEmail = inputValue.trim();
    if (trimmedEmail && !emails.includes(trimmedEmail)) {
      setEmails([...emails, trimmedEmail]);
      setInputValue("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleSaveChanges = () => {
    onSave(emails);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {emails.length > 0 ? "Manage Access" : "Make Form Private"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {emails.length > 0
            ? "Only users with the specified emails will have access to this form."
            : "Making this form private means only selected users will be able to access it."}
        </p>
        <InputGroup className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter user email..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button variant="outline-primary" onClick={handleAddEmail}>
            <EnvelopePlusFill />
          </Button>
        </InputGroup>
        <div className="mt-2">
          {emails.map((email, index) => (
            <div key={index} className="d-flex align-items-center mb-1">
              <span>{email}</span>
              <Button
                variant="link"
                size="sm"
                className="ms-2 text-danger"
                onClick={() => handleRemoveEmail(email)}
              >
                &times;
              </Button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccessControlModal;
