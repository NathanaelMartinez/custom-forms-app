import React from "react";
import { Button } from "react-bootstrap";
import { BarChart, ChatLeftText, Heart, HeartFill, PencilSquare } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { User } from "../../types";

interface FormButtonsProps {
  templateId: string;
  user: User | null;
  templateAuthorId: string;
  liked: boolean;
  handleLikeToggle: () => void;
  setIsCommentSectionVisible: (visible: boolean) => void;
  isCommentSectionVisible: boolean;
  setIsDataTableVisible: (visible: boolean) => void;
  isDataTableVisible: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  templateId,
  user,
  templateAuthorId,
  liked,
  handleLikeToggle,
  setIsCommentSectionVisible,
  isCommentSectionVisible,
  setIsDataTableVisible,
  isDataTableVisible,
}) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center gap-2">
      {(templateAuthorId === user?.id || user?.role === "admin") && (
        <Button
          variant="link"
          onClick={() => navigate(`/templates/${templateId}`)}
          className="custom-contrast-icon-btn"
        >
          <PencilSquare size={24} />
        </Button>
      )}
      {(templateAuthorId === user?.id || user?.role === "admin") && (
        <Button
          variant="link"
          onClick={() => setIsDataTableVisible(!isDataTableVisible)}
          className="custom-contrast-icon-btn"
        >
          <BarChart size={24} />
        </Button>
      )}
      {user && templateAuthorId !== user?.id && (
        <Button
          variant="link"
          className="custom-contrast-icon-btn"
          onClick={handleLikeToggle}
        >
          {liked ? (
            <HeartFill size={24} className="text-danger" />
          ) : (
            <Heart size={24} className="text-dark" />
          )}
        </Button>
      )}
      <Button
        variant="link"
        className="custom-contrast-icon-btn"
        onClick={() => setIsCommentSectionVisible(!isCommentSectionVisible)}
      >
        <ChatLeftText size={24} className="custom-contrast-icon-btn" />
      </Button>
    </div>
  );
};

export default FormButtons;
