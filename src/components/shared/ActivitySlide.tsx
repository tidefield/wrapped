import React from "react";
import type { AllActivitiesStats } from "../../types";
import { BigStatSlide } from "./BigStatSlide";
import { useUnit } from "../../contexts/UnitContext";
import { formatDistance, getDistanceLabel } from "../../utils";

interface Props {
  activity: NonNullable<AllActivitiesStats>["activitiesByType"][0];
}

const getActivityTitle = (activityType: string): string => {
  const type = activityType.toLowerCase();

  const activityMap: Record<string, string> = {
    running: "You ran",
    run: "You ran",
    walk: "You walked",
    walking: "You walked",
    swimming: "You swam",
    swim: "You swam",
    cycling: "You cycled",
    bike: "You biked",
    biking: "You biked",
    hiking: "You hiked",
  };

  return activityMap[type] || `You did ${activityType}`;
};

export const ActivitySlide: React.FC<Props> = ({ activity }) => {
  const { unit } = useUnit();
  const bestMonth = activity.bestMonth.month;
  const title = getActivityTitle(activity.type);
  const distanceLabel = getDistanceLabel(unit);

  return (
    <BigStatSlide
      title={title}
      value={formatDistance(activity.totalDistance, unit)}
      label={`${distanceLabel} in ${activity.totalMonths} months`}
      description={`Best month: ${bestMonth} (${formatDistance(activity.bestMonth.distance, unit)} ${distanceLabel})`}
    />
  );
};
