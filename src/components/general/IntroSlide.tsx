import React from "react";
import type { AllActivitiesStats } from "../../types";
import { getActivityIcon } from "../../utils";

interface Props {
  activitiesStats: NonNullable<AllActivitiesStats>;
}

export const IntroSlide: React.FC<Props> = ({ activitiesStats }) => {
  const activityList = activitiesStats.activitiesByType
    .map((a: { type: string }) => getActivityIcon(a.type))
    .join(" ");

  return (
    <div className="flex flex-col justify-center items-center h-full w-full text-center animate-fade-in-up">
      <div className="text-3xl font-bold">Your 2025</div>
      <div className="text-4xl font-bold mt-5">Fitness (un)Wrapped</div>
      <div className="text-2xl mt-5">{activityList}</div>
    </div>
  );
};
