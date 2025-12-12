export interface MonthlyActivityData {
  month: string; // e.g., "Jun 2025"
  activityType: string; // e.g., "Running", "Swimming", "Walking"
  distance: number; // km from CSV
}

export interface ActivityTypeStats {
  type: string;
  totalDistance: number; // km
  totalMonths: number; // number of months with this activity
  avgDistancePerMonth: number; // km
  bestMonth: {
    month: string;
    distance: number; // km
  };
  percentage: number; // percentage of total distance
}

export interface AllActivitiesStats {
  year: number;
  totalDistance: number; // km
  totalMonths: number; // number of active months
  activitiesByType: ActivityTypeStats[];
  topActivity: string;
  monthlyBreakdown: {
    month: string;
    distance: number; // km
    activities: string[]; // activity types in that month
  }[];
  milestones: {
    firstActivity: string; // month
    bestMonth: {
      month: string;
      distance: number; // km
    };
    bestStreak: number; // consecutive months with any activity
    totalKilometers: number;
  };
}

export interface WeeklyStepsData {
  date: string; // MM/DD/YYYY
  steps: number;
}

export interface StepsStats {
  year: number;
  totalSteps: number;
  averageStepsPerDay: number;
  averageStepsPerWeek: number;
  bestWeek: {
    date: string;
    steps: number;
  };
  bestMonth: {
    month: string;
    steps: number;
  };
  monthlyBreakdown: {
    month: string;
    steps: number;
    weeks: number;
  }[];
  totalWeeks: number;
}
