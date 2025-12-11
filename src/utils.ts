export const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    running: "🏃",
    cycling: "🚴",
    swimming: "🏊",
    walking: "🚶",
    hiking: "🥾",
    default: "🏃",
  };
  return icons[type.toLowerCase()] || icons.default;
};
