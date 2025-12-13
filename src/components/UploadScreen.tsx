import React, { useState, useEffect } from "react";
import ConfettiBackground from "./shared/ConfettiBackground";
import { Unit } from "../contexts/UnitContext";

interface UploadScreenProps {
  onFilesUploaded: (files: File[], unit: Unit) => void;
  sampleFiles?: File[];
  onUseSampleData?: () => void;
  loadSampleData?: () => void;
}

const GOOGLE_SHEETS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/10WdTGpIWflQTDdN__cCTWrwCh2OrWq4ZCqXP6rhlszs/export?format=csv&gid=663162336";

const UploadScreen: React.FC<UploadScreenProps> = ({
  onFilesUploaded,
  sampleFiles = [],
  onUseSampleData,
  loadSampleData,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(sampleFiles);
  const [selectedUnit, setSelectedUnit] = useState<Unit>("km");
  const [loadingText, setLoadingText] = useState<string>("");
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState<string>(
    "https://docs.google.com/spreadsheets/d/10WdTGpIWflQTDdN__cCTWrwCh2OrWq4ZCqXP6rhlszs/edit?gid=663162336#gid=663162336",
  );

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

  const handleFetchFromGoogleSheets = async () => {
    try {
      console.log("[Google Sheets] Starting fetch...");
      console.log("[Google Sheets] Original URL:", googleSheetsUrl);

      setLoadingText("Fetching data from Google Sheets...");

      // Convert edit URL to export CSV URL
      const csvUrl = googleSheetsUrl
        .replace("/edit?gid=", "/export?format=csv&gid=")
        .replace("/edit#gid=", "/export?format=csv&gid=");

      console.log("[Google Sheets] Converted CSV URL:", csvUrl);

      const response = await fetch(csvUrl);
      console.log("[Google Sheets] Response status:", response.status);
      console.log("[Google Sheets] Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      console.log("[Google Sheets] CSV text length:", csvText.length);
      console.log(
        "[Google Sheets] First 200 chars:",
        csvText.substring(0, 200),
      );

      const blob = new Blob([csvText], { type: "text/csv" });
      console.log("[Google Sheets] Blob size:", blob.size);

      const file = new File([blob], "activities.csv", { type: "text/csv" });
      console.log(
        "[Google Sheets] File created:",
        file.name,
        file.size,
        "bytes",
      );

      setUploadedFiles([file]);
      console.log("[Google Sheets] Files set successfully");
    } catch (error) {
      console.error("[Google Sheets] Error details:", error);
      console.error(
        "[Google Sheets] Error message:",
        error instanceof Error ? error.message : "Unknown error",
      );
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(
        `Failed to fetch data from Google Sheets: ${errorMessage}. Please check the URL and try again.`,
      );
    }
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

        onFilesUploaded(uploadedFiles, selectedUnit);
      }
    }
  };

  return (
    <div className="upload-container">
      <ConfettiBackground />
      <h2>🎁 Fitness (un)Wrapped</h2>
      <p className="subtitle">Your year in fitness, free from paywalls</p>

      <div className="instructions">
        <p>
          <strong>Export your fitness data:</strong>
        </p>
        <ol>
          <li>
            <strong>Strava (Recommended):</strong> Request your complete
            archive:{" "}
            <a
              href="https://www.strava.com/athlete/delete_your_account"
              target="_blank"
              rel="noopener"
              style={{ color: "#4d65ff", textDecoration: "underline" }}
            >
              Request Your Archive
            </a>{" "}
            → Click "Request Your Archive". Once you receive the archive, use
            the activities.csv file.
          </li>
          <li>
            <strong>Garmin:</strong>{" "}
            <a
              href="https://connect.garmin.com/modern/report/17/all/last_year"
              target="_blank"
              rel="noopener"
              style={{ color: "#4d65ff", textDecoration: "underline" }}
            >
              Total Distance.csv
            </a>{" "}
            +{" "}
            <a
              href="https://connect.garmin.com/modern/report/29/wellness/last_year"
              target="_blank"
              rel="noopener"
              style={{ color: "#4d65ff", textDecoration: "underline" }}
            >
              Steps.csv
            </a>
          </li>
          <li>Upload CSV files below (activities.csv recommended)</li>
        </ol>

        <div style={{ marginTop: "0.5rem" }}>
          <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
            <strong>Or fetch from StrideSync sheet:</strong>
          </p>
          <input
            type="text"
            value={googleSheetsUrl}
            onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            placeholder="Paste Google Sheets URL here"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "10px",
              borderRadius: "8px",
              border: "2px solid rgba(0, 0, 0, 0.3)",
              fontSize: "14px",
              marginBottom: "0.75rem",
            }}
          />
          <button
            onClick={handleFetchFromGoogleSheets}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "2px solid #4d65ff",
              background: "#4d65ff",
              color: "white",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "16px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            Fetch Data from Google Sheets
          </button>
        </div>

        <div style={{ marginTop: "0.5rem", marginBottom: "1rem" }}>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Distance unit in your CSV files:</strong>
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setSelectedUnit("km")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border:
                  selectedUnit === "km"
                    ? "2px solid #4d65ff"
                    : "2px solid rgba(0, 0, 0, 0.3)",
                background: selectedUnit === "km" ? "#4d65ff" : "white",
                color: selectedUnit === "km" ? "white" : "black",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Kilometers (km)
            </button>
            <button
              onClick={() => setSelectedUnit("mile")}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border:
                  selectedUnit === "mile"
                    ? "2px solid #4d65ff"
                    : "2px solid rgba(0, 0, 0, 0.3)",
                background: selectedUnit === "mile" ? "#4d65ff" : "white",
                color: selectedUnit === "mile" ? "white" : "black",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              Miles (mi)
            </button>
          </div>
        </div>

        <p className="note">
          💡 <strong>Coming soon:</strong> Bulk export from Garmin, plus heart
          rate, sleep data, and sport-personalized cards!
        </p>
      </div>

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <p className="drop-subtext">Drop your CSV files here</p>
        <p className="drop-subtext">
          or click "Let's see what's inside!" to explore with sample data
        </p>
        <input
          type="file"
          id="file-input"
          multiple
          accept=".csv, .zip"
          hidden
          onChange={handleFileChange}
        />
      </div>
      <div className="add-sample-section">
        {/*TODO: Hide this on loading sample data*/}
        <button className="btn-tertiary" onClick={loadSampleData}>
          Try with sample data
        </button>
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
        <button className="btn-primary fs-unmask" onClick={handleSubmit}>
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
        <a
          href="https://github.com/tidefield/unwrapped"
          target="_blank"
          rel="noopener"
          style={{
            color: "#4d65ff",
            textDecoration: "underline",
            fontSize: "0.85rem",
            opacity: 0.8,
          }}
        >
          View source code
        </a>
      </div>
    </div>
  );
};

export default UploadScreen;
