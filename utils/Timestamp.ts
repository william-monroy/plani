import { Timestamp } from "firebase/firestore";

export function timestampToDate(timestamp: Timestamp) {
  return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
}

export function parseDate(date: Date | Timestamp | undefined) {
  if (date === undefined) {
    console.log("Error: date is undefined");
    throw new Error("date is undefined");
    return undefined;
  }
  if (date instanceof Date) {
    return date;
  } else {
    return timestampToDate(date);
  }
}
