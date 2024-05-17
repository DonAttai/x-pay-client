import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Loader } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";

export const Transactions = () => {
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
        <div className="bg-stone-50 rounded-md p-10">
          <DataTable columns={columns} data={transactions} />
        </div>
      ) : (
        <p>No Transactions available</p>
      )}
    </>
  );
};
