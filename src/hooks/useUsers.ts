import axiosInstance from "@/lib/axios";
import { UserCredentialsType } from "@/store/auth-store";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async (): Promise<UserCredentialsType[]> => {
      const res = await axiosInstance.get("users");
      return res.data;
    },
  });
};
