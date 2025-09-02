import { format } from "date-fns";

export const formatDates = (
  date: string | Date | null | undefined,
  dateFormat: string = "dd/MMM/yyyy"
): string | null => {
  if (!date) {
    return null;
  }

  return format(new Date(date), dateFormat);
};
