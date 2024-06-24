import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import axiosInstance from "@/lib/axios";

export type TransactionType = {
  amount: string;
  type: string;
  status: string;
  createdAt: string;
  description: string;
};

export const useTransactions = () => {
  const credentials = useAuth()!;
  return useQuery({
    queryKey: ["transactions", credentials?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `users/${credentials.id}/transactions`
      );
      const data: TransactionType[] = res.data;
      return data.toSorted(
        (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
      );
    },

    enabled: !!credentials?.id,
  });
};
