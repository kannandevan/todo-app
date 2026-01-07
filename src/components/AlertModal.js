import React from 'react';
import './AlertModal.css';

const AlertModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{title}</h3>
                <p className="modal-message">{message}</p>
                <div className="modal-actions">
                    <button className="modal-btn ok-btn" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
