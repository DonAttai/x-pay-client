import { Outlet } from "react-router-dom";
import { AdminLayout } from "@/components/ui/admin-layout";

export const Admin = () => {
  return (
    <section>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </section>
  );
};
