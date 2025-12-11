import React from "react";

interface MonthlyData {
  month: string; // e.g., "January 2024"
  value: number; // e.g., 45.2 (km or steps)
}

interface TimelineSlideProps {
  title: string;
  unit: string; // e.g., "km", "steps"
  monthlyData: MonthlyData[];
  description?: string;
  bestMonth?: MonthlyData; // Explicit best month prop
}

export const TimelineSlide: React.FC<TimelineSlideProps> = ({
  title,
  unit,
  monthlyData,
  description,
  bestMonth: bestMonthProp,
}) => {
  // Use provided bestMonth or calculate it
  const bestMonth =
    bestMonthProp ||
    monthlyData.reduce((best, current) =>
      current.value > best.value ? current : best,
    );

  // Extract month names and normalize to short form (Jan, Feb, etc.)
  const getMonthShort = (monthStr: string): string => {
    return monthStr.split(" ")[0].substring(0, 3);
  };

  return (
    <div className="story-slide active">
      <div className="slide-header">🎁 Fitness (un)Wrapped</div>
      <div className="slide-title">{title}</div>

      {/* Timeline visualization - more compact for 9:16 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          height: "140px",
          margin: "1.5rem 0",
          padding: "0 0.5rem",
          borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
          position: "relative",
        }}
      >
        {monthlyData.map((data, index) => {
          const isBest = data.month === bestMonth.month;
          const height = Math.max((data.value / bestMonth.value) * 100, 8); // Minimum 8% height for better visibility

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Value label above bar - smaller for vertical format */}
              <div
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  marginBottom: "0.35rem",
                  color: isBest ? "#FFD700" : "rgba(255, 255, 255, 0.8)",
                  textShadow: isBest
                    ? "0 0 6px rgba(255, 215, 0, 0.5)"
                    : "none",
                }}
              >
                {data.value.toFixed(1)}
              </div>

              {/* Bar */}
              <div
                style={{
                  width: "70%",
                  height: `${height}%`,
                  background: isBest
                    ? "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)"
                    : "rgba(255, 255, 255, 0.3)",
                  borderRadius: "4px 4px 0 0",
                  transition: "all 0.3s ease",
                  boxShadow: isBest
                    ? "0 0 15px rgba(255, 215, 0, 0.5)"
                    : "none",
                  transform: isBest ? "scale(1.05)" : "scale(1)",
                }}
              />

              {/* Month label */}
              <div
                style={{
                  fontSize: "0.6rem",
                  marginTop: "0.35rem",
                  color: "rgba(255, 255, 255, 0.7)",
                  fontWeight: isBest ? 700 : 400,
                }}
              >
                {getMonthShort(data.month)}
              </div>

              {/* Best month crown */}
              {isBest && (
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    fontSize: "1.2rem",
                    animation: "bounce 1s infinite",
                  }}
                >
                  👑
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Best month highlight - more compact */}
      <div
        style={{
          textAlign: "center",
          marginTop: "0.75rem",
          padding: "0.6rem",
          background: "rgba(255, 215, 0, 0.2)",
          borderRadius: "8px",
          border: "1px solid rgba(255, 215, 0, 0.4)",
        }}
      >
        <div style={{ fontSize: "1rem", fontWeight: 700 }}>
          🏆 Best Month: {bestMonth.month}
        </div>
        <div
          style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: "0.25rem" }}
        >
          {bestMonth.value.toFixed(1)} {unit}
        </div>
      </div>

      {description && (
        <p style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>
          {description}
        </p>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
};
