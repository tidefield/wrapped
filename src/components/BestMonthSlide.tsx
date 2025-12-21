import React from "react";
import type { AllActivitiesStats } from "../types";
import { BigStatSlide } from "./shared/BigStatSlide";
import { useUnit } from "../contexts/UnitContext";
import { formatDistance, getDistanceLabel } from "../utils";

interface Props {
  activitiesStats: NonNullable<AllActivitiesStats>;
}

export const BestMonthSlide: React.FC<Props> = ({ activitiesStats }) => {
  const { unit } = useUnit();
  const distanceLabel = getDistanceLabel(unit);

  return (
    <BigStatSlide
      title="Your best month"
      value={activitiesStats.milestones.bestMonth.month}
      label={`${formatDistance(activitiesStats.milestones.bestMonth.distance, unit)} ${distanceLabel}`}
      description="You were unstoppable!"
    />
  );
};
