import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { EnvelopePlusFill } from "react-bootstrap-icons";

interface AccessControlModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (emails: string[]) => void; // Save all emails on modal close
  onRemoveEmail: (email: string) => void;
  exclusiveEmails: string[]; // Pass initial list of emails
}

const AccessControlModal: React.FC<AccessControlModalProps> = ({
  show,
  onClose,
  onSave,
  exclusiveEmails,
}) => {
  // Use local state to hold the emails within the modal
  const [inputValue, setInputValue] = useState<string>("");
  const [emails, setEmails] = useState<string[]>(exclusiveEmails); // Start with exclusiveEmails

  // Ensure emails are reset when modal opens
  useEffect(() => {
    setEmails(exclusiveEmails);
  }, [exclusiveEmails]);

  const handleAddEmail = () => {
    const trimmedEmail = inputValue.trim();
    if (trimmedEmail && !emails.includes(trimmedEmail)) {
      setEmails([...emails, trimmedEmail]); // Update local state
      setInputValue(""); // Clear input field
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove)); // Update local state
  };

  // Save changes when "Save" is clicked
  const handleSaveChanges = () => {
    onSave(emails); // Pass the entire email list to parent component
    onClose(); // Close the modal
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
            className="input-focus-muted"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button variant="outline-primary" className="custom-outline-primary-btn" onClick={handleAddEmail}>
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
                onClick={() => handleRemoveEmail(email)} // modify local state
              >
                &times;
              </Button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" className="custom-success-btn" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccessControlModal;
