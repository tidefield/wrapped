import type { MonthlyActivityData } from "../types";

const STRAVA_DISTANCE_COLUMN_NAME = "Distance";
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
  console.log("[Activities Parser] Starting parse");
  console.log("[Activities Parser] Text length:", text.length);
  console.log("[Activities Parser] Text preview:", text.substring(0, 500));

  const lines = text.split("\n").filter((line) => line.trim());
  console.log("[Activities Parser] Total lines:", lines.length);

  // Log the header row to understand column structure
  let distanceIdx = 4; // 5th column by default
  if (lines.length > 0) {
    const header = parseCSVLine(lines[0]);
    console.log("[Activities Parser] Header columns:", header);
    header.forEach((col, idx) => {
      console.log(`[Activities Parser] Column ${idx}: "${col}"`);
    });

    distanceIdx = header.findIndex(
      (col) => col.toLowerCase() == STRAVA_DISTANCE_COLUMN_NAME.toLowerCase(),
    );

    // Check first data row to see all values
    if (lines.length > 1) {
      const firstDataRow = parseCSVLine(lines[1]);
      console.log("[Activities Parser] First data row values:");
      firstDataRow.forEach((val, idx) => {
        console.log(`[Activities Parser] Column ${idx}: "${val}"`);
      });
    }
  }

  const activityMap = new Map<string, number>(); // key: `${month}|${activityType}`, value: distance
  let skippedLines = 0;
  let processedLines = 0;

  // Skip header line (line 0)
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    console.log(`[Activities Parser] Line ${i}:`, values.length, "columns");

    if (values.length < 7) {
      console.log(
        `[Activities Parser] Skipping line ${i}: only ${values.length} columns`,
      );
      skippedLines++;
      continue; // Skip malformed lines
    }

    const activityDate = values[1]?.trim(); // Activity Date (column 2)
    const activityType = values[3]?.trim(); // Activity Type (column 4)
    const distanceStr = values[distanceIdx]?.trim(); // Distance (column 5) - CORRECTED!

    console.log(
      `[Activities Parser] Line ${i} - Date: "${activityDate}", Type: "${activityType}", Distance: "${distanceStr}"`,
    );

    if (!activityDate || !activityType || !distanceStr) {
      console.log(
        `[Activities Parser] Skipping line ${i}: missing required fields`,
      );
      skippedLines++;
      continue;
    }

    // Handle European decimal format (comma instead of period)
    const normalizedDistanceStr = distanceStr.replace(",", ".");
    const distance = parseFloat(normalizedDistanceStr);
    if (isNaN(distance) || distance <= 0) {
      console.log(
        `[Activities Parser] Skipping line ${i}: invalid distance "${distanceStr}" (normalized: "${normalizedDistanceStr}")`,
      );
      skippedLines++;
      continue;
    }

    // Parse date to get month-year (e.g., "Jul 2021")
    const monthYear = parseDateToMonthYear(activityDate);
    if (!monthYear) {
      console.log(
        `[Activities Parser] Skipping line ${i}: could not parse date "${activityDate}"`,
      );
      skippedLines++;
      continue;
    }

    // Only include 2025 data
    if (!monthYear.includes("2025")) {
      console.log(
        `[Activities Parser] Skipping line ${i}: not 2025 data (${monthYear})`,
      );
      skippedLines++;
      continue;
    }

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

    console.log(
      `[Activities Parser] Line ${i} - Month: ${monthYear}, Distance: ${distance} ${isSwimming ? "m" : "km"} -> ${finalDistanceInKm} km`,
    );

    // Group by month and activity type
    const key = `${monthYear}|${activityType}`;
    const currentTotal = activityMap.get(key) || 0;
    activityMap.set(key, currentTotal + finalDistanceInKm);
    processedLines++;
  }

  console.log(
    `[Activities Parser] Processed: ${processedLines} lines, Skipped: ${skippedLines} lines`,
  );

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

  console.log(
    `[Activities Parser] Final result: ${result.length} aggregated records`,
  );
  return result;
}

/**
 * Parse date string to month-year format (e.g., "Jul 2021")
 */
function parseDateToMonthYear(dateStr: string): string | null {
  // Expected formats:
  // - "Jul 9, 2021, 5:04:57 PM" (Strava/Garmin)
  // - "2025-12-10" (Google Sheets ISO format)

  try {
    // Handle ISO format first: "2025-12-10"
    const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      const [, year, monthNum, day] = isoMatch;
      const monthIndex = parseInt(monthNum, 10) - 1;

      // Convert month number to month name
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      if (monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]} ${year}`;
      }
    }

    // Handle Strava/Garmin format: "Jul 9, 2021, 5:04:57 PM"
    // Extract month, day, and year manually
    // Pattern: "MMM DD, YYYY, time"
    const match = dateStr.match(/^(\w+)\s+(\d+),\s+(\d+)/);

    if (!match) {
      console.log("[parseDateToMonthYear] No match for date:", dateStr);
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
      console.log("[parseDateToMonthYear] Unknown month:", monthName);
      return null;
    }

    return `${monthName} ${year}`;
  } catch (error) {
    console.error("[parseDateToMonthYear] Error parsing date:", dateStr, error);
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
