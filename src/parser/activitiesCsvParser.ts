import type { MonthlyActivityData } from "../types";

/**
 * Parse Garmin activities CSV file
 * Expected format: Detailed export with Activity Date, Activity Type, Distance columns
 *
 * NOTE: This parser only processes activities from 2025
 */
export async function parseGarminActivitiesCSV(
  file: File,
  distanceUnit: "km" | "mile" = "km",
): Promise<MonthlyActivityData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseActivitiesCSV(text, distanceUnit);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/**
 * Parse activities CSV text into structured data
 */
function parseActivitiesCSV(
  text: string,
  distanceUnit: "km" | "mile",
): MonthlyActivityData[] {
  const lines = text.split("\n").filter((line) => line.trim());
  const activityMap = new Map<string, number>(); // key: `${month}|${activityType}`, value: distance

  // Skip header line (line 0)
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    if (values.length < 7) continue; // Skip malformed lines

    const activityDate = values[1]?.trim(); // Activity Date
    const activityType = values[3]?.trim(); // Activity Type
    const distanceStr = values[6]?.trim(); // Distance (column 7, 0-indexed as 6)

    if (!activityDate || !activityType || !distanceStr) continue;

    const distance = parseFloat(distanceStr);
    if (isNaN(distance) || distance <= 0) continue;

    // Parse date to get month-year (e.g., "Jul 2021")
    const monthYear = parseDateToMonthYear(activityDate);
    if (!monthYear) continue;

    // Only include 2025 data
    if (!monthYear.includes("2025")) continue;

    // Convert swimming distances (in meters) to km
    const isSwimming =
      activityType.toLowerCase() === "swim" ||
      activityType.toLowerCase() === "swimming";
    const distanceInKm = isSwimming
      ? distance / 1000 // Convert meters to km for swimming
      : distance; // Keep as km for other activities

    // Convert miles to km if needed
    const finalDistanceInKm =
      distanceUnit === "mile" ? distanceInKm * 1.60934 : distanceInKm;

    // Group by month and activity type
    const key = `${monthYear}|${activityType}`;
    const currentTotal = activityMap.get(key) || 0;
    activityMap.set(key, currentTotal + finalDistanceInKm);
  }

  // Convert map to array
  const result: MonthlyActivityData[] = [];
  for (const [key, totalDistance] of activityMap.entries()) {
    const [month, activityType] = key.split("|");
    result.push({
      month,
      activityType,
      distance: totalDistance,
    });
  }

  return result;
}

/**
 * Parse date string to month-year format (e.g., "Jul 2021")
 */
function parseDateToMonthYear(dateStr: string): string | null {
  // Expected format: "Jul 9, 2021, 5:04:57 PM"

  try {
    // Extract month, day, and year manually
    // Pattern: "MMM DD, YYYY, time"
    const match = dateStr.match(/^(\w+)\s+(\d+),\s+(\d+)/);

    if (!match) {
      return null;
    }

    const [, monthName, day, year] = match;

    // Format as "Mon YYYY"
    const monthNames: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const monthIndex = monthNames[monthName];
    if (monthIndex === undefined) {
      return null;
    }

    return `${monthName} ${year}`;
  } catch (error) {
    console.error("Error parsing date:", dateStr, error);
    return null;
  }
}

/**
 * Parse a single CSV line, handling quoted values
 * Handles cases where values contain commas by wrapping in quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  // Add the last value
  result.push(current.trim());
  return result;
}
