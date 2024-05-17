import { Link } from "react-router-dom";
import { RecentTransactions } from "../recent-transaction";
import { useTransactions } from "@/hooks/useTransactions";

export const WalletHome = () => {
  const { data: transactions, isSuccess } = useTransactions();
  return (
    <>
      {transactions?.length ? (
        <>
          <span className="flex justify-between mb-4">
            <p>Recent Transactions</p>
            <Link to="/dashboard/transactions" className="text-blue-500">
              {isSuccess && transactions?.length > 4 ? "see more..." : ""}
            </Link>
          </span>

          <RecentTransactions />
        </>
      ) : (
        <p>No Transactions Available</p>
      )}
    </>
  );
};
