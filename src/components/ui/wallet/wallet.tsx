import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader, MoveDown, MoveUpRight } from "lucide-react";
import { formatted } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useAuth } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Wallet = () => {
  const credentials = useAuth()!;
  const { data: wallet, isSuccess, isPending } = useWallet();

  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl animate-spin">
        <Loader className="animate-spin inline-block" />
      </div>
    );
  }

  return (
    <>
      <Card className="flex flex-col items-center mb-2 bg-stone-50 sm:w-2/3">
        <CardHeader>
          <CardTitle>WALLET</CardTitle>
        </CardHeader>
        <CardContent className="rounded-md w-full">
          <div className="flex flex-wrap gap-2 justify-between mb-8">
            <p>Wallet ID: {isSuccess && wallet.id}</p>
            <p>Balance: {isSuccess && formatted(+wallet.balance)}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-lg mx-auto">
            <Button variant={"outline"} onClick={() => navigate("fund-wallet")}>
              Fund Wallet
              <MoveDown size={16} className="ml-2" />
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
        </CardContent>
      </Card>
      <Card className="rounded-md bg-stone-50 mb-4 sm:w-2/3 ">
        <Outlet />
      </Card>
    </>
  );
};
