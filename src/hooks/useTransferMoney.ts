import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/auth-store";
import axiosInstance from "@/lib/axios";

export type TransferMoneyType = {
  walletId: string;
  amount: number;
  type: string;
  description: string;
};

export const useTransferMoney = () => {
  const credentials = useAuth()!;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      userData: TransferMoneyType
    ): Promise<{ message: string }> => {
      const res = await axiosInstance.post(
        `/${credentials.id}/transactions`,
        userData
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet", "all transactions"],
      });
    },
  });
};
