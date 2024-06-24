import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth-store";
import { useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/ui/navbar";
import { Header } from "@/components/ui/header";

export const Dashboard = () => {
  const navigate = useNavigate();
  const credentials = useAuth();

  useEffect(() => {
    if (!credentials?.accessToken) {
      navigate("/login");
    }
  }, [credentials?.accessToken, navigate]);

  return (
    <section className="min-h-screen flex bg-gray-200 ">
      <aside className="bg-stone-50 fixed h-screen w-52 ">
        <div className="h-20 flex justify-center items-center">
          <p className="text-blue-400 text-2xl">X-PAY</p>
        </div>
        <hr />
        <Sidebar />
      </aside>

      <div className="flex-1">
        <Header>
          <Navbar />
        </Header>
        <main className="mt-8 mr-32 ml-56">
          <Outlet />
        </main>
      </div>
    </section>
  );
};
