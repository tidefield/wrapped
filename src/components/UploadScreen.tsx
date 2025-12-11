import React, { useState, useEffect } from "react";

interface UploadScreenProps {
  onFilesUploaded: (files: File[]) => void;
  sampleFiles?: File[];
  onUseSampleData?: () => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({
  onFilesUploaded,
  sampleFiles = [],
  onUseSampleData,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(sampleFiles);

  useEffect(() => {
    setUploadedFiles(sampleFiles);
  }, [sampleFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    if (uploadedFiles.length > 0) {
      // Check if all files are sample files
      const allSampleFiles =
        sampleFiles.length > 0 &&
        uploadedFiles.every((file) => sampleFiles.includes(file));
      const onlySampleFiles =
        allSampleFiles && uploadedFiles.length === sampleFiles.length;

      if (onlySampleFiles && onUseSampleData) {
        // Use sample data
        onUseSampleData();
      } else {
        // Use uploaded files
        onFilesUploaded(uploadedFiles);
      }
    }
  };

  return (
    <div className="upload-container">
      <h1>🎁 Fitness (un)Wrapped</h1>
      <p className="subtitle">Your year in fitness, free from paywalls</p>

      <div className="instructions">
        <p>
          <strong>Export your Garmin data:</strong>
        </p>
        <ol>
          <li>
            <strong>Activity Distance:</strong>{" "}
            <a
              href="https://connect.garmin.com/modern/report/17/all/last_year"
              target="_blank"
              rel="noopener"
            >
              Garmin Connect
            </a>{" "}
          </li>
          <li>
            <strong>Steps:</strong>{" "}
            <a
              href="https://connect.garmin.com/modern/report/29/wellness/last_year"
              target="_blank"
              rel="noopener"
            >
              Garmin Connect
            </a>{" "}
          </li>
          <li>Upload CSV files below (one or both files)</li>
        </ol>
        <p className="note">
          💡 <strong>Coming soon:</strong> Bulk export from Strava & StrideSync,
          plus heart rate, sleep data, and sport-personalized cards!
        </p>
      </div>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <svg
          className="upload-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="drop-text">Drop your CSV files here</p>
        <p className="drop-subtext">
          or click "Let's see what's inside!" to explore with sample data
        </p>
        <input
          type="file"
          id="file-input"
          multiple
          accept=".csv"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="file-list">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="file-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{file.name}</span>
              {sampleFiles.includes(file) && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    marginLeft: "0.5rem",
                  }}
                >
                  Sample Data
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <button className="btn-primary" onClick={handleSubmit}>
          Let's see what's inside!
        </button>
      )}

      <div className="privacy-note">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Your data never leaves your device</span>
      </div>

      <div className="privacy-note" style={{ marginTop: "1rem" }}>
        <span>
          💙 Love this?{" "}
          <a
            href="https://buymeacoffee.com/tidefield"
            target="_blank"
            rel="noopener"
            style={{
              color: "#4d65ff",
              textDecoration: "underline",
              fontWeight: 600,
            }}
          >
            Buy me a coffee
          </a>{" "}
          to keep the caffeine flowing! ☕
        </span>
      </div>
    </div>
  );
};

export default UploadScreen;
