import React, { useState } from "react";

export default function FileDropzone({ file, setFile }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  return (
    <div
      className={`dropzone ${isDragging ? "dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="file-preview">
          {file.type.startsWith("image") ? (
            <img src={URL.createObjectURL(file)} alt="Preview" />
          ) : (
            <div className="file-icon">🎬 {file.name}</div>
          )}
        </div>
      ) : (
        <p>Przeciągnij i upuść plik lub kliknij, aby wybrać</p>
      )}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "none" }}
      />
    </div>
  );
}
