import { create } from "zustand";

export type UserCredentialsType = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
  isVerified: boolean;
  accessToken: string;
};

interface AuthStore {
  credentials: UserCredentialsType | null;

  actions: {
    setCredentials: (credentials: UserCredentialsType) => void;
    logOut: () => void;
  };
}

const userCredentials = JSON.parse(
  localStorage.getItem("credentials") as string
);
const useAuthStore = create<AuthStore>()((set) => ({
  credentials: userCredentials ? userCredentials : null,

  actions: {
    // set user credentials
    setCredentials: (credentials: any) => {
      localStorage.setItem("credentials", JSON.stringify(credentials));
      return set({ credentials });
    },

    // logout
    logOut: () => {
      localStorage.removeItem("credentials");
      return set({ credentials: null });
    },
  },
}));
export const useAuth = () => useAuthStore((state) => state.credentials);

export const useAuthActions = () => useAuthStore((state) => state.actions);
