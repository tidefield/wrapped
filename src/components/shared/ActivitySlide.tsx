import React from "react";
import type { AllActivitiesStats } from "../../types";
import { BigStatSlide } from "./BigStatSlide";

interface Props {
  activity: NonNullable<AllActivitiesStats>["activitiesByType"][0];
}

export const ActivitySlide: React.FC<Props> = ({ activity }) => {
  const bestMonth = activity.bestMonth.month;
  return (
    <BigStatSlide
      title={activity.type}
      value={activity.totalDistance.toFixed(1)}
      label={`kilometers in ${activity.totalMonths} months`}
      description={`Best month: ${bestMonth} (${activity.bestMonth.distance.toFixed(1)} km)`}
    />
  );
};
