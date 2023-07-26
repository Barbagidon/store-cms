import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = (numberString: string): string => {
  const parsedNumber = Number(numberString);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: parsedNumber % 1 === 0 ? 0 : 2,
    maximumFractionDigits: parsedNumber % 1 === 0 ? 0 : 2,
  });
  return formatter.format(parsedNumber);
};
