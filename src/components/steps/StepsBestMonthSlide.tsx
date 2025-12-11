import React from "react";
import type { StepsStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";

interface Props {
  stepsStats: NonNullable<StepsStats>;
}

export const StepsBestMonthSlide: React.FC<Props> = ({ stepsStats }) => {
  const bestSteps = stepsStats.bestMonth.steps.toLocaleString();
  return (
    <BigStatSlide
      title="Your best month"
      value={stepsStats.bestMonth.month}
      valueStyle={{ fontSize: "4rem" }}
      label={`${bestSteps} steps`}
      description="Incredible consistency!"
    />
  );
};
