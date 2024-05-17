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

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roles: string[];
  wallet: { id: string; balance: string };
};

const fetchUser = async (id: string): Promise<UserType> => {
  const res = await axiosInstance(`/users/${id}`);
  return res.data;
};

export const useUser = () => {
  const id = useUserId()!;
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });
};
