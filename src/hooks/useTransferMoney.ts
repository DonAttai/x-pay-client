import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { useUserId } from "@/store/auth-store";

type UserDataType = {
  walletId: string;
  amount: number;
  type: string;
  description: string;
};

const postData = async (
  userData: UserDataType,
  userId: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.post(`/${userId}/transactions`, userData);
  return res.data;
};
export const useTransferMoney = () => {
  const userId = useUserId() as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserDataType) => postData(userData, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
