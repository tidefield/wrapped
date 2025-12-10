import React, { useState } from 'react';

interface UploadScreenProps {
  onFilesUploaded: (files: File[]) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFilesUploaded }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
      onFilesUploaded(uploadedFiles);
    }
  };

  return (
    <div className="upload-container">
      <h1>🏃 Garmin (un)Wrapped</h1>
      <p className="subtitle">Your year in fitness, free from paywalls</p>

      <div className="instructions">
        <p><strong>How to export your Garmin data:</strong></p>
        <ol>
          <li>
            <strong>Activity Distance:</strong> Go to
            <a
              href="https://connect.garmin.com/modern/report/17/all/last_year"
              target="_blank"
              rel="noopener"
            >
              connect.garmin.com/modern/report/17/all/last_year
            </a>
            and download the CSV
          </li>
          <li>
            <strong>Steps:</strong> Go to
            <a
              href="https://connect.garmin.com/modern/report/29/wellness/last_year"
              target="_blank"
              rel="noopener"
            >
              connect.garmin.com/modern/report/29/wellness/last_year
            </a>
            and download the CSV
          </li>
          <li>Upload the CSV files below (you can upload one or both)</li>
        </ol>
        <p className="note">
          💡 For best results, download both files to get a complete picture of your year!
        </p>
      </div>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="drop-text">Drop your Garmin CSV files here</p>
        <p className="drop-subtext">or click to browse • Upload multiple files for more insights</p>
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
            <div key={index} className="file-item">
              {file.name}
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <button className="btn-primary" onClick={handleSubmit}>
          Create My Wrapped
        </button>
      )}

      <div className="privacy-note">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your data never leaves your device</span>
      </div>
    </div>
  );
};

export default UploadScreen;
