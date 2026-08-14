import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

function ToastNotification({ show, message, variant = "success", onClose }) {
  return (
    <div className="toast-floating-container">
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={onClose}
          show={show}
          delay={3000}
          autohide
          bg={variant}
          className="text-white shadow-lg border-0"
        >
          <Toast.Header closeButton={true} className="bg-transparent text-white border-0">
            <i className="fas fa-check-circle me-2 fs-5"></i>
            <strong className="me-auto fs-6">LootKart Notification</strong>
          </Toast.Header>
          <Toast.Body className="pt-0 fw-semibold">{message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default ToastNotification;
