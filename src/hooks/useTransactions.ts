import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { useUserId } from "@/store/auth-store";

export type TransactionType = {
  amount: string;
  type: string;
  status: string;
  createdAt: string;
  description: string;
};
const fetchTransactions = async (userId: string) => {
  const res = await axiosInstance.get(`users/${userId}/transactions`);
  const data: TransactionType[] = res.data;
  return data.toSorted(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
};

export const useTransactions = () => {
  const userId = useUserId() as string;
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => fetchTransactions(userId),
  });
};
