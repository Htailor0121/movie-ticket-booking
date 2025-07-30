import React from 'react';
import './Modal.css'; // Add your modal styles here

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // If the modal is not open, return nothing

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="modal-close" onClick={onClose}>&times;</span> {/* Close button */}
                {children} {/* Render any children passed to the modal */}
            </div>
        </div>
    );
};

export default Modal;
