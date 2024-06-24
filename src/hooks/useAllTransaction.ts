import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { TransactionType } from "./useTransactions";

export const useAllTransactions = () => {
  return useQuery({
    queryKey: ["all transactions"],
    queryFn: async (): Promise<TransactionType[]> => {
      const res = await axiosInstance.get("transactions");
      return res.data;
    },
  });
};
