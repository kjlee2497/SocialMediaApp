import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: string): string {
  const currentDate: Date = new Date();
  const inputDate: Date = new Date(timestamp);

  const seconds: number = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);

  if (seconds < 60) {
    return seconds + ' seconds ago';
  } else if (minutes < 60) {
    return minutes + ' minutes ago';
  } else if (hours < 24) {
    return hours + ' hours ago';
  } else {
    return days + ' days ago';
  }
}