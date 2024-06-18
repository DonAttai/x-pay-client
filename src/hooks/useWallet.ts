import { useQuery } from "@tanstack/react-query";
// import axiosInstance from "./axios";
import { useAuth } from "@/store/auth-store";
import axiosInstance from "@/lib/axios";

export type WalletType = {
  id: string;
  balance: string;
};

export const useWallet = () => {
  const credentials = useAuth()!;
  return useQuery({
    queryKey: ["wallet", credentials?.id],
    queryFn: async (): Promise<WalletType> => {
      const res = await axiosInstance.get(`users/${credentials?.id}/wallet`);
      return res.data;
    },
    enabled: !!credentials?.id,
  });
};
