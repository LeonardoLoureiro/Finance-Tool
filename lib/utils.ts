import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountFromMilliUnits(milliUnits: number) {
  return milliUnits / 1000;
}

export function convertAmountToMilliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current-previous) / previous) * 100;
}