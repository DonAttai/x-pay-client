import axiosInstance from "@/hooks/axios";
import { useUserId } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

// create wallet mutation function
const createWallet = async (id: string) => {
  const res = await axiosInstance.post(`users/${id}/wallet`);
  return res.data;
};

export const CreateWallet = () => {
  const queryClient = useQueryClient();

  const id = useUserId();
  const { isPending, mutate } = useMutation({
    mutationFn: () => createWallet(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  return (
    <Button variant={"outline"} onClick={() => mutate()} disabled={isPending}>
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
