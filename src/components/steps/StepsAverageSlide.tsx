import React from "react";
import type { StepsStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";

interface Props {
  stepsStats: NonNullable<StepsStats>;
}

export const StepsAverageSlide: React.FC<Props> = ({ stepsStats }) => {
  const avgSteps = stepsStats.averageStepsPerDay.toLocaleString();
  return (
    <BigStatSlide
      title="Daily average"
      value={avgSteps}
      label="steps per day"
      description="Keep moving forward!"
    />
  );
};
