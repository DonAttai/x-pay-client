import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// @tanstack/react-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// react-router-dom
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// pages
import { Login } from "@/pages/login.tsx";
import { Home } from "@/pages/home.tsx";
import { Dashboard } from "@/pages/dashboard.tsx";
// components

import { Transactions } from "@/components/ui/transactions/";
import { DashboardHome } from "@/components/ui/dashboard.tsx";
import { AdminDashboard, ManageUsers } from "@/pages/admin-dashboard/index.ts";
import { Register } from "@/pages/register.tsx";
import { FundWallet, TransferMoney, Wallet } from "@/components/ui/wallet";
import { NotFound } from "@/pages/not-found.tsx";
import { Settings } from "./pages/settings.tsx";
import { NotVerified } from "./pages/not-verified.tsx";
import { SuccessPage } from "./pages/success-page.tsx";
import { VerifyEmail } from "./pages/verify-email.tsx";
import { ForgotPassword } from "./pages/forgot-password.tsx";
import { ResetPassword } from "./pages/reset-password.tsx";
import { Admin } from "./pages/admin.tsx";
import { AdminLogin } from "./pages/admin-login.tsx";
// import { AllTransactions } from "./components/ui/all-transactions/all-transactions.tsx";
import { SessionExpiredModal } from "./components/session-expired-modal.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="not-verified" element={<NotVerified />} />
      <Route path="verify-email" element={<VerifyEmail />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="success-page" element={<SuccessPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="admin/dashboard" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="manage-users" element={<ManageUsers />} />
        {/* <Route path="transactions" element={<AllTransactions />} /> */}
      </Route>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="settings" element={<Settings />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="wallet" element={<Wallet />}>
            <Route path="fund-wallet" element={<FundWallet />} />
            <Route path="transfer-money" element={<TransferMoney />} />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      // refetchInterval: 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <SessionExpiredModal />
      <Toaster />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
