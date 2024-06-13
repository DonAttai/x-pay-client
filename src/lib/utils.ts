import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
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

export const toastSuccessMessage = (message: string) => {
  return toast.success(message, { duration: 4000, position: "top-right" });
};
export const toastErrorMessage = (message: string) => {
  return toast.error(message, { duration: 4000, position: "top-right" });
};
