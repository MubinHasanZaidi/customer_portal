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
  },
  {
    label: "Medium",
    value: 2,
  },
  {
    label: "High",
    value: 3,
  },
];

export const TicketType = [
  {
    label: "EPIC",
    value: 1,
  },
  {
    label: "STORY",
    value: 2,
  },
  {
    label: "TASK",
    value: 3,
  },
  {
    label: "BUG",
    value: 4,
  },
  {
    label: "SUB-TASK",
    value: 5,
  },
];


export const getNestedValue = (obj: any, path: any) => {
  if (!path) return undefined;
  return path.split(".").reduce((acc: any, part: any) => acc && acc[part], obj);
};
