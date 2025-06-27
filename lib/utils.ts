import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const UPLOAD_URL = import.meta.env.VITE_API_BASE_URL;

export const getUploadUrl = (fileName: any) => {
  if (fileName) {
    return UPLOAD_URL + "/uploads/" + fileName;
  }
  return "";
};
