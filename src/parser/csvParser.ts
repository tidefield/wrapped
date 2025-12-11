import type { MonthlyActivityData, WeeklyStepsData } from "../types";

/**
 * Parse Garmin steps CSV file
 * Expected format: Date, Steps (with header row)
 */
export async function parseGarminStepsCSV(
  file: File,
): Promise<WeeklyStepsData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseStepsCSV(text);
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
 * Parse steps CSV text into structured data
 */
function parseStepsCSV(text: string): WeeklyStepsData[] {
  const lines = text.split("\n").filter((line) => line.trim());
  const data: WeeklyStepsData[] = [];

  // Skip header line (line 0)
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const stepsData = parseStepsLine(values);

    if (stepsData) {
      data.push(stepsData);
    }
  }

  return data;
}

/**
 * Parse a single line from steps CSV
 */
function parseStepsLine(values: string[]): WeeklyStepsData | null {
  if (values.length < 2) {
    return null;
  }

  const date = values[0]?.trim();
  const steps = parseInt(values[1]?.trim());

  // Validate data
  if (!date || isNaN(steps)) {
    return null;
  }

  return {
    date,
    steps,
  };
}

/**
 * Parse Garmin total distance CSV file
 * Expected format: Month, Activity Type, Distance (with title row and header)
 */
export async function parseGarminTotalDistanceCSV(
  file: File,
): Promise<MonthlyActivityData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseActivityCSV(text);
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
 * Parse activity CSV text into structured data
 */
function parseActivityCSV(text: string): MonthlyActivityData[] {
  const lines = text.split("\n").filter((line) => line.trim());
  const data: MonthlyActivityData[] = [];

  // Skip first two lines (title row and header row)
  for (let i = 2; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const activityData = parseActivityLine(values);

    if (activityData) {
      data.push(activityData);
    }
  }

  return data;
}

/**
 * Parse a single line from activity CSV
 */
function parseActivityLine(values: string[]): MonthlyActivityData | null {
  if (values.length < 3) {
    return null;
  }

  const month = values[0]?.trim();
  const activityType = values[1]?.trim();
  const distance = parseFloat(values[2]?.trim());

  // Validate data
  if (!month || !activityType || isNaN(distance)) {
    return null;
  }

  return {
    month,
    activityType,
    distance,
  };
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
