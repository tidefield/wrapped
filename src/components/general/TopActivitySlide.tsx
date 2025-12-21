import React from "react";
import type { AllActivitiesStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";
import { useUnit } from "../../contexts/UnitContext";
import { formatDistance, getDistanceLabel } from "../../utils";

interface Props {
  activitiesStats: NonNullable<AllActivitiesStats>;
}

export const TopActivitySlide: React.FC<Props> = ({ activitiesStats }) => {
  const { unit, convertDistance } = useUnit();
  const distanceLabel = getDistanceLabel(unit);
  const topActivity = activitiesStats.activitiesByType[0];

  // Calculate marathons and half marathons for running
  const getRunningDescription = (distance: number) => {
    const marathonDistance = 42.195;
    const halfMarathonDistance = 21.0975;

    const marathonInUnit = convertDistance(marathonDistance);
    const halfMarathonInUnit = convertDistance(halfMarathonDistance);

    const marathons = distance / marathonInUnit;
    const halfMarathons = distance / halfMarathonInUnit;

    if (marathons >= 1) {
      return `That's ${marathons.toFixed(1)} marathons! 🏃‍♂️`;
    } else if (halfMarathons >= 1) {
      return `That's ${halfMarathons.toFixed(1)} half-marathons! 🏃‍♀️`;
    } else {
      return `Keep racking up those ${unit}! 💪`;
    }
  };

  // Calculate Everest climbs for walking
  const getWalkingDescription = (distance: number) => {
    const everestHeight = 8.848; // km (height of Mount Everest)
    const everestInUnit = convertDistance(everestHeight);

    const everests = distance / everestInUnit;

    if (everests >= 1) {
      return `That's ${everests.toFixed(1)} Mount Everests climbed! 🏔️`;
    } else {
      const percentageOfEverest = ((distance / everestInUnit) * 100).toFixed(1);
      return `That's ${percentageOfEverest}% of an Everest climb! 🧗`;
    }
  };

  const isRunning =
    topActivity.type.toLowerCase() === "running" ||
    topActivity.type.toLowerCase() === "run";

  const isWalking =
    topActivity.type.toLowerCase() === "walking" ||
    topActivity.type.toLowerCase() === "walk";

  const description = isRunning
    ? getRunningDescription(topActivity.totalDistance)
    : isWalking
      ? getWalkingDescription(topActivity.totalDistance)
      : `${topActivity.percentage.toFixed(0)}% of your total distance`;

  return (
    <BigStatSlide
      title="Your top activity"
      value={topActivity.type}
      label={`${formatDistance(topActivity.totalDistance, unit)} ${distanceLabel}`}
      description={description}
    />
  );
};
