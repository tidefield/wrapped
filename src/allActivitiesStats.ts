import type { MonthlyActivityData, AllActivitiesStats, ActivityTypeStats } from './types';

export function calculateAllActivitiesStats(data: MonthlyActivityData[]): AllActivitiesStats {
  if (data.length === 0) {
    return getEmptyStats();
  }

  // Extract year from first entry
  const yearMatch = data[0].month.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

  // Calculate totals
  const totalDistance = data.reduce((sum, d) => sum + d.distance, 0);

  // Group by activity type
  const activityTypeMap = new Map<string, MonthlyActivityData[]>();
  data.forEach(d => {
    if (!activityTypeMap.has(d.activityType)) {
      activityTypeMap.set(d.activityType, []);
    }
    activityTypeMap.get(d.activityType)!.push(d);
  });

  // Calculate stats for each activity type
  const activitiesByType: ActivityTypeStats[] = [];
  const monthAbbreviations: { [key: string]: string } = {
    'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
    'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
    'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
  };

  activityTypeMap.forEach((activities, type) => {
    const typeDistance = activities.reduce((sum, a) => sum + a.distance, 0);
    const uniqueMonths = new Set(activities.map(a => a.month)).size;

    // Find best month for this activity
    const monthlyTotals = new Map<string, number>();
    activities.forEach(a => {
      // Convert abbreviated month to full name
      const monthMatch = a.month.match(/^(\w{3})/);
      const monthName = monthMatch ? monthMatch[1] : '';
      const fullMonthName = monthAbbreviations[monthName] || a.month;

      monthlyTotals.set(fullMonthName, (monthlyTotals.get(fullMonthName) || 0) + a.distance);
    });

    // Initialize bestMonth with the first activity's month (converted to full name)
    const firstActivityMonthMatch = activities[0].month.match(/^(\w{3})/);
    const firstActivityMonthName = firstActivityMonthMatch ? firstActivityMonthMatch[1] : '';
    const firstActivityFullMonth = monthAbbreviations[firstActivityMonthName] || activities[0].month;
    let bestMonth = { month: firstActivityFullMonth, distance: 0 };

    monthlyTotals.forEach((dist, month) => {
      if (dist > bestMonth.distance) {
        bestMonth = { month, distance: dist };
      }
    });

    activitiesByType.push({
      type,
      totalDistance: typeDistance,
      totalMonths: uniqueMonths,
      avgDistancePerMonth: typeDistance / uniqueMonths,
      bestMonth,
      percentage: (typeDistance / totalDistance) * 100,
    });
  });

  // Sort by total distance
  activitiesByType.sort((a, b) => b.totalDistance - a.totalDistance);

  // Top activity
  const topActivity = activitiesByType[0]?.type || 'Unknown';

  // Monthly breakdown with all activities
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthlyMap = new Map<string, { distance: number; activities: Set<string> }>();

  data.forEach(d => {
    // Extract full month name - handle both abbreviated and full month names
    const monthMatch = d.month.match(/^(\w{3,9})/);
    const monthName = monthMatch ? monthMatch[1] : '';

    // Convert abbreviated month to full name
    const monthAbbreviations: { [key: string]: string } = {
      'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
      'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
      'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
    };

    const fullMonthName = monthAbbreviations[monthName] || monthName;

    if (fullMonthName) {
      if (!monthlyMap.has(fullMonthName)) {
        monthlyMap.set(fullMonthName, { distance: 0, activities: new Set() });
      }
      const current = monthlyMap.get(fullMonthName)!;
      current.distance += d.distance;
      current.activities.add(d.activityType);
    }
  });

  const monthlyBreakdown = monthOrder
    .map(month => {
      const data = monthlyMap.get(month);
      return {
        month,
        distance: data?.distance || 0,
        activities: data ? Array.from(data.activities) : [],
      };
    })
    .filter(m => m.distance > 0);

  // Find best month overall
  let bestMonthOverall = { month: monthlyBreakdown[0]?.month || 'Unknown', distance: 0 };
  monthlyBreakdown.forEach(m => {
    if (m.distance > bestMonthOverall.distance) {
      bestMonthOverall = { month: m.month, distance: m.distance };
    }
  });

  // Calculate longest streak
  const monthsWithData = monthOrder.map((month, index) => ({
    month,
    index,
    hasData: monthlyMap.has(month),
  }));

  let longestStreak = 0;
  let currentStreak = 0;

  monthsWithData.forEach(m => {
    if (m.hasData) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Total unique months with any activity
  const totalMonths = monthlyBreakdown.length;

  // First activity month
  const firstActivity = monthlyBreakdown[0]?.month || 'Unknown';

  return {
    year,
    totalDistance,
    totalMonths,
    activitiesByType,
    topActivity,
    monthlyBreakdown,
    milestones: {
      firstActivity,
      bestMonth: bestMonthOverall,
      bestStreak: longestStreak,
      totalKilometers: Math.round(totalDistance),
    },
  };
}

function getEmptyStats(): AllActivitiesStats {
  return {
    year: new Date().getFullYear(),
    totalDistance: 0,
    totalMonths: 0,
    activitiesByType: [],
    topActivity: 'Unknown',
    monthlyBreakdown: [],
    milestones: {
      firstActivity: 'Unknown',
      bestMonth: { month: 'Unknown', distance: 0 },
      bestStreak: 0,
      totalKilometers: 0,
    },
  };
}
