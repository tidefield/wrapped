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
import ConfettiBackground from "./shared/ConfettiBackground";
import { useUnit } from "../contexts/UnitContext";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons/faArrowRotateRight";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons/faArrowRotateLeft";

interface WrappedScreenProps {}

const WrappedScreen: React.FC<WrappedScreenProps> = ({}) => {
  const navigate = useNavigate();
  const { screenId } = useParams();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(
    Number(screenId || 0),
  );
  const { unit } = useUnit();

  const [activitiesStats, setActivitiesStats] =
    useState<AllActivitiesStats | null>(null);
  const [stepsStats, setStepsStats] = useState<StepsStats | null>(null);

  useEffect(() => {
    try {
      const activitiesStats = JSON.parse(
        localStorage.getItem("activitiesStats") || "null",
      );
      const stepsStats = JSON.parse(
        localStorage.getItem("stepsStats") || "null",
      );

      if (!activitiesStats && !stepsStats) {
        console.log("Re routing user to home page");
        navigate("/");
        return;
      }
      setActivitiesStats(activitiesStats);
      setStepsStats(stepsStats);
    } catch (error) {
      console.error("Error loading stats from local storage:", error);
      console.log("Re routing user to home page");
      navigate("/");
    }
  }, []);

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

  const navigateToScreen = (screenId: number) => {
    navigate(`/wrapped/${screenId}`, { replace: true });
    setCurrentSlideIndex(screenId);
  };

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
      navigateToScreen(currentSlideIndex + 1);
    } else if (currentSlideIndex === totalSlides - 1) {
      clearDataAndRestart();
    }
  };

  // Clear the local storage and reload the page to
  // reset the user to the intro page
  const clearDataAndRestart = () => {
    localStorage.removeItem("activitiesStats");
    localStorage.removeItem("stepsStats");
    window.location.reload();
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      navigateToScreen(currentSlideIndex - 1);
    } else if (currentSlideIndex === 0) {
      clearDataAndRestart();
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

    return <CurrentSlideComponent />;
  };

  const renderProgressDots = () => {
    return (
      <div id="progress-dots">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlideIndex ? "active" : ""}`}
            onClick={() => navigateToScreen(index)}
          />
        ))}
      </div>
    );
  };

  if (totalSlides === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <h3>
          Uh oh. Either your data is broken or I can't handle your data yet.
        </h3>
        <br />
        <h3>Please leave a feedback.</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div id="capture-area" className="capture-area">
        <ConfettiBackground />
        <div id="story-container">{renderCurrentSlide()}</div>
      </div>

      <div
        className="navigation"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "0.9rem",
            color: "rgba(255, 255, 255, 0.6)",
            fontWeight: 500,
          }}
        >
          Showing distances in {unit === "mile" ? "miles" : "kilometers"}
        </div>
        <button className="nav-btn nav-btn-left" onClick={prevSlide}>
          {currentSlideIndex === 0 ? (
            <FontAwesomeIcon
              icon={faArrowRotateLeft}
              style={{ width: "18px" }}
            />
          ) : (
            <FontAwesomeIcon icon={faAngleLeft} />
          )}
        </button>
        {renderProgressDots()}
        <button className="nav-btn nav-btn-right" onClick={nextSlide}>
          {currentSlideIndex === totalSlides - 1 ? (
            <FontAwesomeIcon
              icon={faArrowRotateRight}
              style={{ width: "18px" }}
            />
          ) : (
            <FontAwesomeIcon icon={faAngleRight} />
          )}
        </button>
      </div>
    </div>
  );
};

export default WrappedScreen;
