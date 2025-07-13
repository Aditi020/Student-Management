import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import '../styles/components/Modal.css';

const DeleteModal = ({ isOpen, onClose, onConfirm, studentName, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-icon danger">
            <AlertTriangle className="modal-icon-svg" />
          </div>
          <h3 className="modal-title">Delete Student</h3>
          <div className="modal-message">
            Are you sure you want to delete{' '}
            <strong>{studentName}</strong>? This action cannot be undone.
          </div>
          <div className="modal-actions">
            <button
              onClick={onClose}
              disabled={loading}
              className="modal-btn cancel"
            >
              <X className="modal-btn-icon" />
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="modal-btn danger"
            >
              {loading ? (
                <div className="modal-loading">
                  <div className="modal-loading-spinner"></div>
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="modal-btn-icon" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;