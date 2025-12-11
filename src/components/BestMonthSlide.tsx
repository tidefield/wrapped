import React from "react";
import type { AllActivitiesStats } from "../types";
import { BigStatSlide } from "./shared/BigStatSlide";

interface Props {
  activitiesStats: NonNullable<AllActivitiesStats>;
}

export const BestMonthSlide: React.FC<Props> = ({ activitiesStats }) => (
  <BigStatSlide
    title="Your best month"
    value={activitiesStats.milestones.bestMonth.month}
    valueStyle={{ fontSize: "4rem" }}
    label={`${activitiesStats.milestones.bestMonth.distance.toFixed(1)} km`}
    description="You were unstoppable!"
  />
);
