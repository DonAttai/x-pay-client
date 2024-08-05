import { NavLink } from "react-router-dom";
import {
  UserCredentialsType,
  useAuth,
  useAuthActions,
} from "@/store/auth-store";
import { UserProfile } from "./user-profile";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const credentials = useAuth()!;
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex flex-col w-full ml-48 bg-stone-50 ">
        <Header user={credentials} />
        <main className="flex-grow overflow-y-auto px-4 py-6 content mt-4">
          {children}
        </main>
      </div>
    </div>
  );
};

function SideBar() {
  return (
    <aside className="fixed top-0 left-0 bg-gray-600 text-white w-48 min-h-screen overflow-y-auto sidebar">
      <nav className="space-y-2 mt-16">
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
    <nav className="bg-blue-600 text-white fixed top-0 left-48 right-0 w-auto shadow-md z-10 navbar ">
      <div className="flex items-center justify-between px-4 py-2 w-full">
        <div className="text-xl px-3 py-2 font-bold inline-block mr-4">
          X-Pay Admin
        </div>
        <div className="px-3 py-2 font-medium inline-block mr-4">
          <UserProfile user={user} signOut={signOut} />
        </div>
      </div>
    </nav>
  );
}
