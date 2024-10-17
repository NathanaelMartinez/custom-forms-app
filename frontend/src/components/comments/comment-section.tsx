import React from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Comment, User } from "../../types";
import { PersonCircle } from "react-bootstrap-icons";

interface CommentSectionProps {
  comments: Comment[];
  user: User | null;
  newComment: string;
  setNewComment: (comment: string) => void;
  handleCommentSubmit: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  user,
  newComment,
  setNewComment,
  handleCommentSubmit,
}) => {

  return (
    <div
      className="bg-white shadow-sm"
      style={{
        width: "400px",
        padding: "20px",
        minHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <h3 className="fs-4 fw-bold text-dark mb-3">{comments.length} Comments</h3>

      {user ? (
        <div className="d-flex align-items-start mb-3">
          <PersonCircle size={36} className="text-muted me-3" />
          <Form.Group controlId="newComment" className="flex-grow-1">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Join the conversation..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 input-focus-muted"
            />
            <Button
              variant="primary"
              className="custom-success-btn"
              onClick={handleCommentSubmit}
            >
              Add Comment
            </Button>
          </Form.Group>
        </div>
      ) : (
        <Alert variant="info" className="mb-3">
          <a href="/login" className="text-primary">
            Login
          </a>{" "}
          or{" "}
          <a href="/sign-up" className="text-primary">
            Sign up
          </a>{" "}
          to join the conversation.
        </Alert>
      )}

      <div>
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="mb-2 p-2 shadow-sm custom-card">
              <Card.Body className="d-flex">
                <PersonCircle size={36} className="text-muted me-3" />
                <div>
                  <Card.Title className="mb-1 fs-6 fw-bold text-dark">
                    {comment.author?.username}{" "}
                    <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </Card.Title>
                  <Card.Text className="text-dark">{comment.content}</Card.Text>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
