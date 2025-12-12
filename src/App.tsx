import React, { useState, useEffect } from "react";
import {
  parseGarminTotalDistanceCSV,
  parseGarminStepsCSV,
  parseGarminActivitiesCSV,
} from "./parser/csvParser";
import { calculateAllActivitiesStats } from "./allActivitiesStats";
import { calculateStepsStats } from "./stepsStats";
import type { AllActivitiesStats, StepsStats } from "./types";
import UploadScreen from "./components/UploadScreen";
import LoadingScreen from "./components/LoadingScreen";
import WrappedScreen from "./components/WrappedScreen";
import Footer from "./components/shared/Footer";
import { UnitProvider, useUnit } from "./contexts/UnitContext";

type Screen = "upload" | "loading" | "wrapped";

function AppContent() {
  const { setUnit } = useUnit();
  const [currentScreen, setCurrentScreen] = useState<Screen>("upload");
  const [activitiesStats, setActivitiesStats] =
    useState<AllActivitiesStats | null>(null);
  const [stepsStats, setStepsStats] = useState<StepsStats | null>(null);
  const [loadingText, setLoadingText] = useState("Loading sample data...");
  const [sampleFiles, setSampleFiles] = useState<File[]>([]);

  // Load sample data on mount
  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      setLoadingText("Loading sample data...");

      // Load sample activity data
      const activityResponse = await fetch("/sample_data/Total Distance.csv");
      const activityText = await activityResponse.text();
      const activityFile = new File([activityText], "Total Distance.csv", {
        type: "text/csv",
      });

      // Load sample steps data
      const stepsResponse = await fetch("/sample_data/Steps.csv");
      const stepsText = await stepsResponse.text();
      const stepsFile = new File([stepsText], "Steps.csv", {
        type: "text/csv",
      });

      // Store sample files for display
      setSampleFiles([activityFile, stepsFile]);
    } catch (error) {
      console.error("Error loading sample data:", error);
      setLoadingText("Failed to load sample data. Please upload your files.");
      setCurrentScreen("upload");
    }
  };

  const processSampleData = async () => {
    setCurrentScreen("loading");
    setLoadingText("Loading sample data...");

    // Set the unit to km for sample data
    setUnit("km");

    try {
      // Load sample activity data
      const activityResponse = await fetch("/sample_data/Total Distance.csv");
      const activityText = await activityResponse.text();
      const activityFile = new File([activityText], "Total Distance.csv", {
        type: "text/csv",
      });

      // Load sample steps data
      const stepsResponse = await fetch("/sample_data/Steps.csv");
      const stepsText = await stepsResponse.text();
      const stepsFile = new File([stepsText], "Steps.csv", {
        type: "text/csv",
      });

      setLoadingText("Parsing data...");
      const activityData = await parseGarminTotalDistanceCSV(activityFile);
      const stepsData = await parseGarminStepsCSV(stepsFile);

      setLoadingText("Calculating your stats...");
      setActivitiesStats(calculateAllActivitiesStats(activityData));
      setStepsStats(calculateStepsStats(stepsData));

      setCurrentScreen("wrapped");
    } catch (error) {
      console.error("Error processing sample data:", error);
      setLoadingText("Failed to process sample data. Please try again.");
      setCurrentScreen("upload");
    }
  };

  const handleFilesUploaded = async (files: File[], unit: "km" | "mile") => {
    setCurrentScreen("loading");

    // Set the unit in context
    setUnit(unit);

    try {
      const allActivityData = [];
      const allStepsData = [];

      for (const file of files) {
        setLoadingText(`Parsing ${file.name}...`);

        if (file.name.toLowerCase().includes("steps")) {
          const data = await parseGarminStepsCSV(file, unit);
          allStepsData.push(...data);
        } else if (file.name.toLowerCase().includes("activities")) {
          const data = await parseGarminActivitiesCSV(file, unit);
          allActivityData.push(...data);
        } else {
          const data = await parseGarminTotalDistanceCSV(file, unit);
          allActivityData.push(...data);
        }
      }

      setLoadingText("Calculating your stats...");

      if (allActivityData.length > 0) {
        setActivitiesStats(calculateAllActivitiesStats(allActivityData));
      }

      if (allStepsData.length > 0) {
        setStepsStats(calculateStepsStats(allStepsData));
      }

      setCurrentScreen("wrapped");
    } catch (error) {
      console.error("Error processing files:", error);
      alert(
        "Failed to process files. Please check your CSV files and try again.",
      );
      setCurrentScreen("upload");
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "upload":
        return (
          <UploadScreen
            onFilesUploaded={handleFilesUploaded}
            sampleFiles={sampleFiles}
            onUseSampleData={processSampleData}
          />
        );
      case "loading":
        return <LoadingScreen text={loadingText} />;
      case "wrapped":
        return (
          <WrappedScreen
            activitiesStats={activitiesStats}
            stepsStats={stepsStats}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="app"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ display: "flex" }}>{renderScreen()}</div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <UnitProvider>
      <AppContent />
    </UnitProvider>
  );
}

export default App;
