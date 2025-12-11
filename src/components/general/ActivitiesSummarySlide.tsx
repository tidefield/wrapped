import React from "react";
import type { AllActivitiesStats } from "../../types";
import { BigStatSlide } from "../shared/BigStatSlide";
import { getActivityIcon } from "../../utils";

interface Props {
  activitiesStats: NonNullable<AllActivitiesStats>;
}

export const ActivitiesSummarySlide: React.FC<Props> = ({
  activitiesStats,
}) => {
  return (
    <BigStatSlide title={`${activitiesStats!.year} in numbers`}>
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "-10%",
          fontSize: "15rem",
          opacity: 0.03,
          transform: "rotate(-15deg)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        🏃
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "-5%",
          fontSize: "12rem",
          opacity: 0.03,
          transform: "rotate(25deg)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        🚴
      </div>

      {/* Activities with icons */}
      <div
        style={{
          fontSize: "1.4rem",
          margin: "2rem 0",
          lineHeight: 2,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {activitiesStats!.activitiesByType.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>
              {getActivityIcon(a.type)}
            </span>
            <span>
              <strong>{a.totalDistance.toFixed(1)} km</strong>{" "}
              {a.type.toLowerCase()}
            </span>
          </div>
        ))}
      </div>
    </BigStatSlide>
  );
};
