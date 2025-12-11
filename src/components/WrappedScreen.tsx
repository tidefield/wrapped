import React, { useState, useEffect } from "react";
import type { AllActivitiesStats, StepsStats } from "../types";
import { IntroSlide } from "./general/IntroSlide";
import { TotalDistanceSlide } from "./shared/TotalDistanceSlide";
import { TopActivitySlide } from "./general/TopActivitySlide";
import { ActivitySlide } from "./shared/ActivitySlide";
import { BestMonthSlide } from "./BestMonthSlide";
import { ActivitiesSummarySlide } from "./general/ActivitiesSummarySlide";
import { StepsTotalSlide } from "./steps/StepsTotalSlide";
import { StepsAverageSlide } from "./steps/StepsAverageSlide";
import { BestWeekSlide } from "./steps/BestWeekSlide";
import { StepsBestMonthSlide } from "./steps/StepsBestMonthSlide";
// import { StepsTimelineSlide } from "./steps/StepsTimelineSlide";

interface WrappedScreenProps {
  activitiesStats: AllActivitiesStats | null;
  stepsStats: StepsStats | null;
}

const WrappedScreen: React.FC<WrappedScreenProps> = ({
  activitiesStats,
  stepsStats,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Calculate total number of slides
  const totalSlides = React.useMemo(() => {
    let count = 0;
    if (activitiesStats) {
      // Intro + Total Distance + Top Activity + Top 3 activities + Best Month + Streak + Outro
      count += 3 + Math.min(activitiesStats.activitiesByType.length, 3) + 3;
    }
    if (stepsStats) {
      // Intro + Total Steps + Average + Best Week + Best Month
      count += 5;
    }
    return count;
  }, [activitiesStats, stepsStats]);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [activitiesStats, stepsStats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlideIndex]);

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Define all slide components in order
  const slides: React.ComponentType<any>[] = [
    // Activities slides (Source: Total Distance.csv)
    IntroSlide,
    ActivitiesSummarySlide,
    TotalDistanceSlide,
    TopActivitySlide,
    // Individual activity slides (dynamic - up to 3)
    ...(activitiesStats
      ? activitiesStats.activitiesByType.slice(0, 3).map((activity) => {
          // Create a wrapper component for this specific activity
          return () => <ActivitySlide activity={activity} />;
        })
      : []),
    BestMonthSlide,
    // Steps slides
    StepsTotalSlide,
    StepsAverageSlide,
    BestWeekSlide,
    // StepsTimelineSlide,
    StepsBestMonthSlide,
  ];

  // Filter and render the current slide
  const renderCurrentSlide = (): React.ReactElement => {
    const availableSlides = slides.filter((SlideComponent) => {
      // Check if this slide should render based on data availability
      if (
        SlideComponent === IntroSlide ||
        SlideComponent === TotalDistanceSlide ||
        SlideComponent === TopActivitySlide ||
        SlideComponent === BestMonthSlide ||
        SlideComponent === ActivitiesSummarySlide
      ) {
        return activitiesStats !== null;
      }
      if (
        SlideComponent === StepsTotalSlide ||
        SlideComponent === StepsAverageSlide ||
        SlideComponent === BestWeekSlide ||
        SlideComponent === StepsBestMonthSlide
        // SlideComponent === StepsTimelineSlide
      ) {
        return stepsStats !== null;
      }
      return true;
    });

    const CurrentSlideComponent = availableSlides[currentSlideIndex];

    if (!CurrentSlideComponent) {
      return (
        <div style={{ color: "white", padding: "2rem" }}>No slide found</div>
      );
    }

    // Pass props to components that need them
    if (CurrentSlideComponent === IntroSlide && activitiesStats) {
      return <IntroSlide activitiesStats={activitiesStats} />;
    }
    if (CurrentSlideComponent === TotalDistanceSlide && activitiesStats) {
      return <TotalDistanceSlide activitiesStats={activitiesStats} />;
    }
    if (CurrentSlideComponent === TopActivitySlide && activitiesStats) {
      return <TopActivitySlide activitiesStats={activitiesStats} />;
    }
    if (CurrentSlideComponent === BestMonthSlide && activitiesStats) {
      return <BestMonthSlide activitiesStats={activitiesStats} />;
    }
    if (CurrentSlideComponent === ActivitiesSummarySlide && activitiesStats) {
      return <ActivitiesSummarySlide activitiesStats={activitiesStats} />;
    }
    if (CurrentSlideComponent === StepsTotalSlide && stepsStats) {
      return <StepsTotalSlide stepsStats={stepsStats} />;
    }
    if (CurrentSlideComponent === StepsAverageSlide && stepsStats) {
      return <StepsAverageSlide stepsStats={stepsStats} />;
    }
    if (CurrentSlideComponent === BestWeekSlide && stepsStats) {
      return <BestWeekSlide stepsStats={stepsStats} />;
    }
    if (CurrentSlideComponent === StepsBestMonthSlide && stepsStats) {
      return <StepsBestMonthSlide stepsStats={stepsStats} />;
    }
    // if (CurrentSlideComponent === StepsTimelineSlide && stepsStats) {
    //   return <StepsTimelineSlide stepsStats={stepsStats} />;
    // }

    return <CurrentSlideComponent />;
  };

  const renderProgressDots = () => {
    return (
      <div id="progress-dots">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlideIndex ? "active" : ""}`}
            onClick={() => setCurrentSlideIndex(index)}
          />
        ))}
      </div>
    );
  };

  if (totalSlides === 0) {
    return (
      <div style={{ color: "white", padding: "2rem", background: "red" }}>
        <h2>No data available</h2>
        <p>Activities: {activitiesStats ? "Yes" : "No"}</p>
        <p>Steps: {stepsStats ? "Yes" : "No"}</p>
      </div>
    );
  }

  return (
    <div id="capture-area" className="capture-area">
      <div id="story-container">{renderCurrentSlide()}</div>

      <div className="navigation">
        <button
          className="nav-btn"
          onClick={prevSlide}
          disabled={currentSlideIndex === 0}
        >
          ←
        </button>
        {renderProgressDots()}
        <button
          className="nav-btn"
          onClick={nextSlide}
          disabled={currentSlideIndex === totalSlides - 1}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default WrappedScreen;
