import { useAllTransactions } from "@/hooks/useAllTransaction";
import { useUsers } from "@/hooks/useUsers";
import { formatted, toastErrorMessage } from "@/lib/utils";
import { useAuth } from "@/store/auth-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const credentials = useAuth()!;

  const { data: users } = useUsers();
  const { data: transactions } = useAllTransactions();

  const activeUsers = users?.filter((user) => user.isActive === true);
  const verifiedUsers = users?.filter((user) => user.isVerified === true);

  const totalAmount = transactions?.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );

  useEffect(() => {
    if (!credentials?.accessToken) {
      navigate("/admin");
    }
    if (credentials?.accessToken && !credentials?.roles.includes("admin")) {
      navigate("/admin");
      toastErrorMessage("Access Denied");
    }
    if (
      credentials?.accessToken &&
      credentials.roles.includes("admin") &&
      !credentials.isVerified
    ) {
      toastErrorMessage("User not verified");
      navigate("/admin");
    }
  }, [
    credentials?.accessToken,
    navigate,
    credentials?.roles,
    credentials?.isVerified,
  ]);

  return (
    <div className="p-4 mt-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-3xl">{users && users.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Active Users</h2>
          <p className="text-3xl">{activeUsers && activeUsers.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Verified Users</h2>
          <p className="text-3xl">{verifiedUsers && verifiedUsers.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Transactions</h2>
          <p className="text-3xl">{transactions && transactions.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow w-full">
          <h2 className="text-xl font-bold">Total Amount Transacted</h2>
          <p className="text-3xl truncate">
            {totalAmount && formatted(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};
