import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { format, isSameDay, differenceInMinutes } from "date-fns";
import { Comment, User } from "../../types";
import {
  fetchCommentsForTemplate,
  addCommentToTemplate,
} from "../../services/comment-service";

interface CommentSectionProps {
  templateId: string;
  user: User | null;
  newComment: string;
  setNewComment: (comment: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  templateId,
  user,
  newComment,
  setNewComment,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await fetchCommentsForTemplate(templateId);
        // Reverse the comments array to show the newest comments first
        setComments(data.reverse());
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [templateId]);

  const handleSubmit = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const payload = { content: newComment };
      const newCommentData = await addCommentToTemplate(templateId, payload);
      setComments((prevComments) => [newCommentData, ...prevComments]); // Add new comment at the top
      setNewComment(""); // clear comment input after submission
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const formatDate = (commentDate: Date) => {
    const now = new Date();

    const minutesAgo = differenceInMinutes(now, commentDate);

    if (minutesAgo < 60) {
      return `${minutesAgo} minutes ago`; // show minutes if w/in hour
    }

    if (isSameDay(commentDate, now)) {
      return format(commentDate, "p"); // show time if today
    }

    return format(commentDate, "MM/dd/yy"); // show date otherwise
  };

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
      <h3 className="fs-4 fw-bold text-dark mb-3">
        {comments.length} Comments
      </h3>

      {user ? (
        <div className="d-flex align-items-start mb-3">
          <img
            src="https://i.pravatar.cc/300?u=uniqueUser"
            alt="Profile"
            className="rounded-circle me-2"
            width="56"
            height="56"
          />
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
              onClick={handleSubmit}
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
        {loading ? (
          <p className="text-muted">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-muted">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment, index) => (
            <Card.Body key={comment.id} className="d-flex">
              {/* container to prevent picture stretching */}
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  overflow: "hidden",
                  borderRadius: "50%",
                }}
                className="me-3"
              >
                <img
                  src={`https://i.pravatar.cc/300?u=${index}`}
                  alt="Profile"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div>
                <Card.Title className="mb-1 fs-6 fw-bold text-dark">
                  {comment.author?.username}{" "}
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </Card.Title>
                <Card.Text className="text-dark">{comment.content}</Card.Text>
              </div>
            </Card.Body>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
