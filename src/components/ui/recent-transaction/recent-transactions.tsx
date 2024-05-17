import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

export const RecentTransactions = () => {
  const { data: transactions, isPending, isSuccess } = useTransactions();
  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen text-3xl animate-spin">
        <Loader />
      </div>
    );
  }
  return (
    <>
      {isSuccess && transactions?.length ? (
        <div>
          <DataTable columns={columns} data={transactions.slice(0, 4)} />
        </div>
      ) : (
        <p>No Transactions available</p>
      )}
    </>
  );
};
