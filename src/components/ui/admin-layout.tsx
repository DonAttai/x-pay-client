import { NavLink } from "react-router-dom";
import { CreateUserDialog } from "./create-user-dialog";
import {
  UserCredentialsType,
  useAuth,
  useAuthActions,
} from "@/store/auth-store";
import { UserProfile } from "./user-profile";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const credentials = useAuth()!;
  return (
    <div className="flex">
      <SideBar />
      <div className="flex-1 min-h-screen bg-stone-50 ">
        <Header user={credentials} />
        <main className="p-4">
          <main>{children}</main>
        </main>
      </div>
    </div>
  );
};

function SideBar() {
  return (
    <aside className="bg-gray-600 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "block py-2 px-4 rounded bg-gray-700"
              : "block py-2 px-4 rounded hover:bg-gray-700"
          }
          end
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/dashboard/manage-users"
          className={({ isActive }) =>
            isActive
              ? "block py-2 px-4 rounded bg-gray-700"
              : "block py-2 px-4 rounded hover:bg-gray-700"
          }
          end
        >
          Manage Users
        </NavLink>

        <div className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
          <CreateUserDialog />
        </div>
      </nav>
    </aside>
  );
}

function Header({ user }: { user: UserCredentialsType }) {
  const { adminLogOut } = useAuthActions();

  const signOut = () => {
    adminLogOut();
  };
  return (
    <header className="bg-blue-600 text-white p-4 pr-10 flex justify-between items-center">
      <div className="text-lg font-bold">X-Pay Admin</div>
      <div className="flex items-center">
        <UserProfile user={user} signOut={signOut} />
      </div>
    </header>
  );
}
