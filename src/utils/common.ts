import { format } from "date-fns";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;
export const formatDates = (
  date: string | Date | null | undefined,
  dateFormat: string = "dd/MMM/yyyy",
): string | null => {
  if (!date) {
    return null;
  }

  return format(new Date(date), dateFormat);
};

export const generateImageUrl = (path: any) => {
  return `${API_BASE_URL}${path}`;
};

export const PriorityType = [
  {
    label: "Low",
    value: 1,
    color: "green",
  },
  {
    label: "Medium",
    value: 2,
    color: "orange",
  },
  {
    label: "High",
    value: 3,
    color: "red",
  },
];

export const TicketType = [
  {
    label: "EPIC",
    value: 1,
    show: false,
  },
  {
    label: "STORY",
    value: 2,
    show: false,
  },
  {
    label: "TASK",
    value: 3,
    show: true,
  },
  {
    label: "BUG",
    value: 4,
    show: true,
  },
  {
    label: "SUB-TASK",
    value: 5,
    show: false,
  },
];

export const getNestedValue = (obj: any, path: any) => {
  if (!path) return undefined;
  return path.split(".").reduce((acc: any, part: any) => acc && acc[part], obj);
};

export function formatDateTime(date: any) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDate(date: any) {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
