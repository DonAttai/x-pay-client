import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { useAuth } from "@/store/auth-store";

export type TransactionType = {
  amount: string;
  type: string;
  status: string;
  createdAt: string;
  description: string;
};
const fetchTransactions = async (userId: number) => {
  const res = await axiosInstance.get(`users/${userId}/transactions`);
  const data: TransactionType[] = res.data;
  return data.toSorted(
    (a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))
  );
};

export const useTransactions = () => {
  const credentials = useAuth()!;
  return useQuery({
    queryKey: ["transactions", credentials?.id],
    queryFn: () => fetchTransactions(credentials?.id),
    enabled: !!credentials?.id,
  });
};
