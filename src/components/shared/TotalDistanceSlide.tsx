import React from "react";
import type { AllActivitiesStats } from "../../types";
import { BigStatSlide } from "./BigStatSlide";

interface Props {
  activitiesStats: NonNullable<AllActivitiesStats>;
}

export const TotalDistanceSlide: React.FC<Props> = ({ activitiesStats }) => {
  const totalKm = activitiesStats.totalDistance.toFixed(1);
  const marathons = (activitiesStats.totalDistance / 42.195).toFixed(1);
  return (
    <BigStatSlide
      title="You moved"
      value={totalKm}
      label="kilometers"
      description={`That's equivalent to ${marathons} marathons!`}
    />
  );
};
