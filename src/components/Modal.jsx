import React from "react";
import "../index.css";
import FileUploader from "./FileUploader";
export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return (
    <div className="backdrop">
      <div className="modal-window">
        {children}
        <button className="close-button" onClick={onClose}>
          {" "}
          Close{" "}
        </button>
      </div>
    </div>
  );
}
