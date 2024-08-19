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

function sortedTransactions(transactions: TransactionType[]) {
  return transactions.sort(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );
}

export const useTransactions = () => {
  const credentials = useAuth()!;
  return useQuery({
    queryKey: ["transactions", credentials?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `users/${credentials.id}/transactions`
      );
      return sortedTransactions(res.data);
    },

    enabled: !!credentials?.id,
  });
};
