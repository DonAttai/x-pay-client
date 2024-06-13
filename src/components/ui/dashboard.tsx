import { Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { formatted } from "@/lib/utils";
import { RecentTransactions } from "./recent-transaction";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallet } from "@/hooks/useWallet";

export const DashboardHome = () => {
  const { data: wallet, isSuccess: isWallet, isPending } = useWallet();
  const { data: transactions, isSuccess: isTransaction } = useTransactions();

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
          {wallet ? (
            <>
              <p>Wallet ID: {isWallet && wallet.id}</p>
              <p>Balance: {isWallet && formatted(+wallet.balance)}</p>
            </>
          ) : (
            <div>Create and Fund your wallet to start making transactions!</div>
          )}
        </div>
      </div>
      {isTransaction && transactions?.length ? (
        <div className="bg-stone-50 rounded-md p-10">
          <span className="flex justify-between mb-4">
            <p>Recent Transactions</p>
            <Link to="/dashboard/transactions" className="text-blue-500">
              {isTransaction && transactions.length > 4 ? "see more..." : ""}
            </Link>
          </span>

          <RecentTransactions />
        </div>
      ) : null}
    </div>
  );
};
