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
    GOOGLE_SHEETS_CSV_URL,
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

    // Start audio playback
    const audioElement = document.getElementById(
      "bg-audio",
    ) as HTMLAudioElement;
    if (audioElement) {
      audioElement.muted = false;
      audioElement.play();
    }
  };

  return (
    <div className="flex flex-col" style={{ maxWidth: "600px" }}>
      <ConfettiBackground />
      <span className="text-4xl my-4 text-center">🎁 Fitness (un)Wrapped</span>
      <span className="text-2xl my-4 text-center">
        Your year in fitness, free from paywalls
      </span>

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
              className="text-brand-blue underline"
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
              className="text-brand-blue underline"
            >
              Total Distance.csv
            </a>{" "}
            +{" "}
            <a
              href="https://connect.garmin.com/modern/report/29/wellness/last_year"
              target="_blank"
              rel="noopener"
              className="text-brand-blue underline"
            >
              Steps.csv
            </a>
          </li>
          <li>Upload CSV files below (activities.csv recommended)</li>
        </ol>

        <div className="mt-2">
          <p className="mb-2 text-sm">
            <strong>Or fetch from StrideSync sheet:</strong>
          </p>
          <input
            type="text"
            value={googleSheetsUrl}
            onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            placeholder="Paste Google Sheets URL here"
            className="w-full max-w-[500px] p-2.5 rounded-lg border-2 border-black/30 text-sm mb-3"
          />
          <button
            onClick={handleFetchFromGoogleSheets}
            className="py-2.5 px-6 rounded-lg border-2 border-brand-blue bg-brand-blue text-white cursor-pointer font-semibold text-base w-full max-w-[500px]"
          >
            Fetch Data from Google Sheets
          </button>
        </div>

        <div className="mt-2 mb-4">
          <p className="mb-2">
            <strong>Distance unit in your CSV files:</strong>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedUnit("km")}
              className={`py-2 px-5 rounded-lg border-2 cursor-pointer font-semibold text-base ${
                selectedUnit === "km"
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-black/30 bg-white text-black"
              }`}
            >
              Kilometers (km)
            </button>
            <button
              onClick={() => setSelectedUnit("mile")}
              className={`py-2 px-5 rounded-lg border-2 cursor-pointer font-semibold text-base ${
                selectedUnit === "mile"
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-black/30 bg-white text-black"
              }`}
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
      <div className="flex justify-center">
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
              className="file-item flex justify-between items-center"
            >
              <span>{file.name}</span>
              {sampleFiles.includes(file) && (
                <span className="text-xs bg-white/20 py-1 px-2 rounded ml-2">
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
    </div>
  );
};

export default UploadScreen;
