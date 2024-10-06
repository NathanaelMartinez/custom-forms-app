import React from "react";

interface ToolbarProps {
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}

const AdminToolBar: React.FC<ToolbarProps> = ({ onBlock, onUnblock, onDelete }) => {
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
        className="btn btn-danger"
        onClick={onDelete}
      >
        <i className="bi bi-trash"></i> Delete
      </button>
    </div>
  );
};

export default AdminToolBar;
