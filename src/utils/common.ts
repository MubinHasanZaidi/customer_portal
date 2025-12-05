import { format } from "date-fns";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/uploads/`;
export const formatDates = (
  date: string | Date | null | undefined,
  dateFormat: string = "dd/MMM/yyyy"
): string | null => {
  if (!date) {
    return null;
  }

  return format(new Date(date), dateFormat);
};

export const generateImageUrl = (path: any) => {
  return `${API_BASE_URL}${path}`;
};
