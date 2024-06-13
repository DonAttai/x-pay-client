import axiosInstance from "@/hooks/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useAuth } from "@/store/auth-store";

export const CreateWallet = () => {
  const queryClient = useQueryClient();
  const { id } = useAuth()!;

  const { isPending, mutate } = useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.post(`users/${id}/wallet`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", id] });
    },
  });

  return (
    <Button variant={"outline"} onClick={() => mutate(id)} disabled={isPending}>
      {isPending ? (
        <>
          <Loader className="animate-spin inline-block" />
          Creating Wallet...
        </>
      ) : (
        "Create Wallet"
      )}
    </Button>
  );
};
