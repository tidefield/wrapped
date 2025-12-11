import React from "react";
import type { StepsStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";

interface Props {
  stepsStats: NonNullable<StepsStats>;
}

export const BestWeekSlide: React.FC<Props> = ({ stepsStats }) => {
  const bestSteps = stepsStats.bestWeek.steps.toLocaleString();
  const weekDate = new Date(stepsStats.bestWeek.date).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" },
  );
  return (
    <BigStatSlide
      title="Your best week"
      value={bestSteps}
      label={`steps (week of ${weekDate})`}
      description="You were on fire!"
    />
  );
};
