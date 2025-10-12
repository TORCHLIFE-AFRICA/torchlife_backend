import { baseUrl } from "./constants";

export function getFormattedMessage(input: string) {
  return input.replace(/\n/g, "<br />");
}

export function getEnrollmentUrl(enrollmentId: string) {
  return `${baseUrl}/enrollments?enrollmentId=${enrollmentId}`;
}

export const formatCurrency = (value: string | number | undefined, abbreviate: boolean = false): string => {
  if (!value) return "₦0";

  const num = Number(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "₦0";

  if (!abbreviate) {
    return `₦${num.toLocaleString()}`;
  }

  const absNum = Math.abs(num);
  let formatted = "";

  if (absNum >= 1e12) {
    formatted = `${(num / 1e12).toFixed(2)}T`;
  } else if (absNum >= 1e9) {
    formatted = `${(num / 1e9).toFixed(2)}B`;
  } else if (absNum >= 1e6) {
    formatted = `${(num / 1e6).toFixed(2)}M`;
  } else if (absNum >= 1e3) {
    formatted = `${(num / 1e3).toFixed(1)}K`;
  } else {
    formatted = num.toString();
  }

  return `₦${formatted}`;
};

export function getDateTimeString(
  input?: string,
  type: "date-only" | "date-time" | "time-only" | "year-only" = "date-time"
): string {
  if (!input) return "";
  const date = new Date(input);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let options: any;

  if (type === "date-time") {
    options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  } else if (type === "time-only") {
    options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  } else if (type === "date-only") {
    options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  } else if (type === "year-only") {
    options = {
      year: "numeric",
    };
  }

  return date.toLocaleString("en-US", options);
}
