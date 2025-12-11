import type { WeeklyStepsData, StepsStats } from './types';

export function calculateStepsStats(data: WeeklyStepsData[]): StepsStats {
  if (data.length === 0) {
    return getEmptyStats();
  }

  // Extract year from first entry
  const firstDate = new Date(data[0].date);
  const year = firstDate.getFullYear();

  // Calculate totals
  const totalSteps = data.reduce((sum, d) => sum + d.steps, 0);
  const totalWeeks = data.length;

  // Approximate average per day (assuming 7 days per week)
  const averageStepsPerWeek = totalSteps / totalWeeks;
  const averageStepsPerDay = Math.round(averageStepsPerWeek / 7);

  // Find best week
  let bestWeek = { date: data[0].date, steps: data[0].steps };
  data.forEach(d => {
    if (d.steps > bestWeek.steps) {
      bestWeek = { date: d.date, steps: d.steps };
    }
  });

  // Group by month
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthlyMap = new Map<string, { steps: number; weeks: number }>();

  data.forEach(d => {
    const date = new Date(d.date);
    const monthIndex = date.getMonth();
    const monthName = monthOrder[monthIndex];

    if (!monthlyMap.has(monthName)) {
      monthlyMap.set(monthName, { steps: 0, weeks: 0 });
    }
    const current = monthlyMap.get(monthName)!;
    current.steps += d.steps;
    current.weeks += 1;
  });

  const monthlyBreakdown = monthOrder
    .map(month => {
      const data = monthlyMap.get(month);
      return {
        month,
        steps: data?.steps || 0,
        weeks: data?.weeks || 0,
      };
    })
    .filter(m => m.steps > 0);

  // Find best month
  let bestMonth = { month: monthlyBreakdown[0]?.month || 'Unknown', steps: 0 };
  monthlyBreakdown.forEach(m => {
    if (m.steps > bestMonth.steps) {
      bestMonth = { month: m.month, steps: m.steps };
    }
  });

  return {
    year,
    totalSteps,
    averageStepsPerDay,
    averageStepsPerWeek: Math.round(averageStepsPerWeek),
    bestWeek,
    bestMonth,
    monthlyBreakdown,
    totalWeeks,
  };
}

function getEmptyStats(): StepsStats {
  return {
    year: new Date().getFullYear(),
    totalSteps: 0,
    averageStepsPerDay: 0,
    averageStepsPerWeek: 0,
    bestWeek: { date: 'Unknown', steps: 0 },
    bestMonth: { month: 'Unknown', steps: 0 },
    monthlyBreakdown: [],
    totalWeeks: 0,
  };
}
