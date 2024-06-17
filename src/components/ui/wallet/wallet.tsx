import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import { formatted } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/store/auth-store";

export const Wallet = () => {
  const credentials = useAuth()!;
  const { data: wallet, isSuccess } = useWallet();

  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-stone-50 rounded-md p-10 mb-4">
        <div className="flex justify-between mb-8">
          <p>Wallet ID: {isSuccess && wallet.id}</p>
          <p>Balance: {isSuccess && formatted(+wallet.balance)}</p>
        </div>
        <div className="flex justify-center gap-4">
          <Button variant={"outline"} onClick={() => navigate("fund-wallet")}>
            Fund Wallet
          </Button>
          <Button
            variant={"outline"}
            onClick={() => navigate("transfer-money")}
          >
            Transfer Money
            <MoveUpRight size={16} className="ml-2" />
          </Button>
          {credentials?.roles.includes("admin") ? (
            <>
              <Button variant={"outline"}>Deposite Money</Button>
              <Button variant={"outline"}>Withdraw Money</Button>
            </>
          ) : null}
        </div>
      </div>
      <div className="bg-stone-50 rounded-md p-10">
        <Outlet />
      </div>
    </div>
  );
};
