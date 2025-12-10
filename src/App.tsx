import React, { useState } from 'react';
import { parseGarminCSV, parseGarminStepsCSV } from './csvParser';
import { calculateAllActivitiesStats } from './allActivitiesStats';
import { calculateStepsStats } from './stepsStats';
import type { AllActivitiesStats, StepsStats } from './types';
import UploadScreen from './components/UploadScreen';
import LoadingScreen from './components/LoadingScreen';
import WrappedScreen from './components/WrappedScreen';

type AspectRatio = 'square' | 'story' | 'landscape';
type Screen = 'upload' | 'loading' | 'wrapped';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('upload');
  const [activitiesStats, setActivitiesStats] = useState<AllActivitiesStats | null>(null);
  const [stepsStats, setStepsStats] = useState<StepsStats | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('square');
  const [loadingText, setLoadingText] = useState('Analyzing your activities...');

  const handleFilesUploaded = async (files: File[]) => {
    setCurrentScreen('loading');

    try {
      const allActivityData = [];
      const allStepsData = [];

      for (const file of files) {
        setLoadingText(`Parsing ${file.name}...`);

        if (file.name.toLowerCase().includes('steps')) {
          const data = await parseGarminStepsCSV(file);
          allStepsData.push(...data);
        } else {
          const data = await parseGarminCSV(file);
          allActivityData.push(...data);
        }
      }

      setLoadingText('Calculating your stats...');

      if (allActivityData.length > 0) {
        setActivitiesStats(calculateAllActivitiesStats(allActivityData));
      }

      if (allStepsData.length > 0) {
        setStepsStats(calculateStepsStats(allStepsData));
      }

      setCurrentScreen('wrapped');
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Failed to process files. Please check your CSV files and try again.');
      setCurrentScreen('upload');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'upload':
        return <UploadScreen onFilesUploaded={handleFilesUploaded} />;
      case 'loading':
        return <LoadingScreen text={loadingText} />;
      case 'wrapped':
        return (
          <WrappedScreen
            activitiesStats={activitiesStats}
            stepsStats={stepsStats}
            selectedRatio={selectedRatio}
            onRatioChange={setSelectedRatio}
          />
        );
      default:
        return null;
    }
  };

  return <div id="app">{renderScreen()}</div>;
}

export default App;
