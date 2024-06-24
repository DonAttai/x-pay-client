import { useAuth, useAuthActions } from "@/store/auth-store";

import { UserProfile } from "./user-profile";

export const Navbar = () => {
  const { logOut } = useAuthActions();
  const credentials = useAuth()!;

  const signOut = () => {
    logOut();
  };

  return (
    <div className="px-3 py-2 font-medium inline-block mr-4">
      <UserProfile user={credentials} signOut={signOut} />
    </div>
  );
};
