import * as zip from "@zip.js/zip.js";
import { MonthlyActivityData } from "../types";
const MONTHS = [
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
export const parseGarminZip = async (
  zipFile: File,
): Promise<MonthlyActivityData[]> => {
  const zipReader = new zip.ZipReader(new zip.BlobReader(zipFile));
  const entries = await zipReader.getEntries();
  const activitySummariesFileEntry = entries.find((entry) =>
    entry.filename.endsWith("summarizedActivities.json"),
  );
  /* @ts-ignore */
  const jsonFileBlob = await activitySummariesFileEntry?.getData(
    new zip.BlobWriter(),
    {},
  );
  const data = await parseGarminActivitiesJSON(jsonFileBlob);
  return data;
};

/**
 * Parse Garmin activities JSON file
 * Expected format: Detailed export with Activity Date, Activity Type, Distance columns
 *
 * NOTE: This parser only processes activities from 2025
 */
export async function parseGarminActivitiesJSON(
  blob: Blob,
  distanceUnit: "km" | "mile" = "km",
): Promise<MonthlyActivityData[]> {
  const text = await blob.text();
  // const data = parseActivitiesJSON(text, distanceUnit);
  const rawData = JSON.parse(text);
  const summarizedActivitiesObject = rawData.flat();
  const allActivities =
    summarizedActivitiesObject[0].summarizedActivitiesExport;
  const activitiesData = allActivities
    .filter((activity: any) => {
      const date = new Date(activity.startTimeGmt);
      return date.getFullYear() == 2025;
    })
    .map((activity: any) => {
      const month = MONTHS[new Date(activity.startTimeGmt).getMonth()];
      const year = new Date(activity.startTimeGmt).getFullYear();
      const activityType = activity.activityType;

      const key = `${month} ${year}|${activityType}`;
      return {
        key,
        distance: activity.distance / (1000 * 100),
        date: MONTHS[new Date(activity.startTimeGmt).getMonth()],
        activityData: activityType,
      };
    });
  const activityMap = new Map<string, number>(); // key: `${month}|${activityType}`, value: distance

  for (const activity of activitiesData) {
    const key = activity.key;
    const distance = activity.distance;
    const currentTotal = activityMap.get(key) || 0;
    activityMap.set(key, currentTotal + distance);
  }
  const monthlyActivityData: MonthlyActivityData[] = [];
  for (const [key, totalDistance] of activityMap.entries()) {
    const [month, activityType] = key.split("|");
    monthlyActivityData.push({
      month,
      activityType,
      distance: Number.isNaN(totalDistance) ? 0 : totalDistance,
    });
  }

  return monthlyActivityData;
}
