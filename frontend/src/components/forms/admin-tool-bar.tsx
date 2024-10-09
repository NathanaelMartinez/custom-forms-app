import React from "react";

interface ToolbarProps {
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
  onPromote: () => void;
  onDemote: () => void;
}

const AdminToolBar: React.FC<ToolbarProps> = ({
  onBlock,
  onUnblock,
  onDelete,
  onPromote,
  onDemote,
}) => {
  return (
    <div className="d-flex justify-content-start">
      <button
        type="button"
        className="btn btn-danger me-2"
        onClick={onBlock}
      >
        <i className="bi bi-lock"></i> Block
      </button>
      <button
        type="button"
        className="btn btn-secondary me-2"
        onClick={onUnblock}
      >
        <i className="bi bi-unlock"></i> Unblock
      </button>
      <button
        type="button"
        className="btn btn-success ms-3"
        onClick={onPromote}
      >
        <i className="bi bi-person-up"></i> Make Admin
      </button>
      <button
        type="button"
        className="btn btn-danger ms-2"
        onClick={onDemote}
      >
        <i className="bi bi-person-down"></i> Demote Admin
      </button>
      <button
        type="button"
        className="btn btn-danger position-absolute delete-btn"
        onClick={onDelete}
      >
        <i className="bi bi-trash"></i> Delete
      </button>
    </div>
  );
};

export default AdminToolBar;
