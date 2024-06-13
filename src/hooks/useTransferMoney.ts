import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { useAuth } from "@/store/auth-store";

type UserDataType = {
  walletId: string;
  amount: number;
  type: string;
  description: string;
};

export const useTransferMoney = () => {
  const credentials = useAuth()!;
  const userId = credentials?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      userData: UserDataType
    ): Promise<{ message: string }> => {
      const res = await axiosInstance.post(`/${userId}/transactions`, userData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
