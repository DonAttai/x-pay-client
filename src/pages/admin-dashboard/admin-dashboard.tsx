import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
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
        <DashboardCard title="Total Users" content={users?.length!} />
        <DashboardCard title="Active Users" content={activeUsers?.length!} />
        <DashboardCard
          title="Verified Users"
          content={verifiedUsers?.length!}
        />
        <DashboardCard
          title="Total Transactions"
          content={transactions?.length!}
        />
        <DashboardCard
          title="Total Amount Transacted"
          content={formatted(totalAmount ?? 0)}
        />
      </div>
    </div>
  );
};

function DashboardCard({ title, content }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold truncate">{content ?? 0}</p>
      </CardContent>
    </Card>
  );
}

interface DashboardCardProps {
  title: string;
  content: string | number;
}
