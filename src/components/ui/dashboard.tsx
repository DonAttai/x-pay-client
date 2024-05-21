import { Link } from "react-router-dom";
import { useUser } from "@/hooks/use-user";
import { Loader } from "lucide-react";
import { formatted } from "@/lib/utils";
import { RecentTransactions } from "./recent-transaction";
import { useTransactions } from "@/hooks/useTransactions";

export const DashboardHome = () => {
  const { data: user, isPending, isSuccess } = useUser();
  const { data: transactions } = useTransactions();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl animate-spin">
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <div className="bg-stone-50 rounded-md p-10 mb-4">
        <div className="flex justify-between mb-8">
          {user?.wallet ? (
            <>
              <p>Wallet ID: {isSuccess && user.wallet.id}</p>
              <p>Balance: {isSuccess && formatted(+user.wallet.balance)}</p>
            </>
          ) : (
            <div>
              Create and Fund your wallet to start making transactions!wa
            </div>
          )}
        </div>
      </div>
      {transactions?.length ? (
        <div className="bg-stone-50 rounded-md p-10">
          <span className="flex justify-between mb-4">
            <p>Recent Transactions</p>
            <Link to="/dashboard/transactions" className="text-blue-500">
              {transactions.length > 4 ? "see more..." : ""}
            </Link>
          </span>

          <RecentTransactions />
        </div>
      ) : null}
    </div>
  );
};
