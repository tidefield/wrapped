import React from "react";
import type { StepsStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";

interface Props {
  stepsStats: NonNullable<StepsStats>;
}

export const StepsTotalSlide: React.FC<Props> = ({ stepsStats }) => {
  const totalSteps = stepsStats.totalSteps.toLocaleString();
  const distanceKm = ((stepsStats.totalSteps * 0.762) / 1000).toFixed(1);

  // Calculate around the Earth
  const stepsDistanceKm = parseFloat(distanceKm);
  const earthCircumference = 40075; // km around the equator

  const getEarthComparison = () => {
    const timesAroundEarth = stepsDistanceKm / earthCircumference;

    if (timesAroundEarth >= 1) {
      return `You've walked around the Earth ${timesAroundEarth.toFixed(2)} times! 🌍`;
    } else {
      const percentageOfGlobe = (timesAroundEarth * 100).toFixed(1);
      return `That's ${percentageOfGlobe}% around the world! 🗺️`;
    }
  };

  return (
    <BigStatSlide
      title="You walked"
      value={totalSteps}
      label="steps"
      description={getEarthComparison()}
    />
  );
};
