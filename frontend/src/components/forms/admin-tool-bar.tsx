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
    <div className="d-flex justify-content-between w-100">
      <div>
        <button type="button" className="btn btn-danger me-2" onClick={onBlock}>
          <i className="bi bi-lock"></i> Block
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onUnblock}
        >
          <i className="bi bi-unlock"></i> Unblock
        </button>
      </div>

      <div>
        <button
          type="button"
          className="btn btn-success"
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
      </div>

      <div>
        <button
          type="button"
          className="btn btn-danger delete-btn"
          onClick={onDelete}
        >
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
    </div>
  );
};

export default AdminToolBar;
