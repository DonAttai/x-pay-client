import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatted = (amount: number) => {
  return new Intl.NumberFormat("NGN", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

export const getFullName = (firstName: string, lastName: string) => {
  return `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
    lastName
  )}`;
};
