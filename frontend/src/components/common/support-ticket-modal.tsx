import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useSupportModal } from "../../context/support-modal-context";

const SupportTicketModal: React.FC = () => {
  const {
    showSupportModal,
    setShowSupportModal,
    summary,
    setSummary,
    priority,
    setPriority,
    handleSupportSubmit,
  } = useSupportModal();

  return (
    <Modal show={showSupportModal} onHide={() => setShowSupportModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Support</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Issue Summary</Form.Label>
            <Form.Control
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Briefly describe your issue"
              className="input-focus-muted"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={priority}
              className="input-focus-muted"
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowSupportModal(false)}>
          Cancel
        </Button>
        <Button variant="primary" className="custom-success-btn" onClick={handleSupportSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SupportTicketModal;
