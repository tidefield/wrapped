import React from "react";
import type { StepsStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";
import { TimelineSlide } from "../shared/TimelineSlide";

interface Props {
  stepsStats: NonNullable<StepsStats>;
}

export const StepsTimelineSlide: React.FC<Props> = ({ stepsStats }) => {
  const monthlyData = stepsStats.monthlyBreakdown.map((item) => ({
    month: item.month,
    value: item.steps,
  }));

  return (
    <TimelineSlide
      title={`${stepsStats.year} Steps Timeline`}
      unit="steps"
      monthlyData={monthlyData}
      description="Your step count throughout the year"
    />
  );
};
