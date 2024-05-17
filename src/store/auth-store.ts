import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export type UserCredentialsType = { accessToken: string };

interface AuthStore {
  userCredentials: UserCredentialsType | null;

  actions: {
    setCredentials: (credentials: UserCredentialsType) => void;
    logOut: () => void;
  };
}

const userCredentials = JSON.parse(localStorage.getItem("userInfo") as string);
const useAuthStore = create<AuthStore>()((set) => ({
  userCredentials: userCredentials ? userCredentials : null,

  actions: {
    // set user credentials
    setCredentials: (credentials: any) => {
      localStorage.setItem("userInfo", JSON.stringify(credentials));
      return set({ userCredentials: credentials });
    },

    // logout
    logOut: () => {
      localStorage.removeItem("userInfo");
      return set({ userCredentials: null });
    },
  },
}));
export const useAuth = () => useAuthStore((state) => state.userCredentials);

export const useAuthActions = () => useAuthStore((state) => state.actions);

export const useUserId = () => {
  const userCredentials = useAuth();
  if (userCredentials === null) return null;
  const decoded = jwtDecode(userCredentials?.accessToken as string);
  return decoded.sub;
};
