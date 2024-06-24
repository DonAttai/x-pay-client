import { useAuth, useAuthActions } from "@/store/auth-store";

import { UserProfile } from "./user-profile";

export const Navbar = () => {
  const { logOut } = useAuthActions();
  const credentials = useAuth()!;

  const signOut = () => {
    logOut();
  };

  return (
    <>
      <UserProfile user={credentials} signOut={signOut} />
    </>
  );
};
