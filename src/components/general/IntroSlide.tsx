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
    <div
      className="story-slide active"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <div className="slide-title">Your 2025</div>
      <div
        className="stat-value"
        style={{ fontSize: "3.5rem", margin: "3rem 0" }}
      >
        Fitness (un)Wrapped
      </div>
      <div style={{ fontSize: "2rem", margin: "1rem 0" }}>{activityList}</div>
    </div>
  );
};
