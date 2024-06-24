import axiosInstance from "@/lib/axios";
import { toastErrorMessage } from "@/lib/utils";
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
    setCredentials: (credentials: UserCredentialsType | null) => void;
    logOut: () => void;
    adminLogOut: () => void;
  };
}
const storedCredentials = localStorage.getItem("credentials");
const credentials = storedCredentials
  ? (JSON.parse(storedCredentials) as UserCredentialsType)
  : null;

const useAuthStore = create<AuthStore>()((set) => ({
  credentials: credentials || null,

  actions: {
    // set user credentials
    setCredentials: (credentials) => {
      localStorage.setItem("credentials", JSON.stringify(credentials));
      set({ credentials });
    },
    // logout
    logOut: async () => {
      try {
        const res = await axiosInstance.post("/auth/logout");
        if (res.data) {
          localStorage.removeItem("credentials");
          set({ credentials: null });
          window.location.replace("/login");
        }
      } catch (error) {
        toastErrorMessage("Logout failed");
      }
    },

    // admin logout
    adminLogOut: async () => {
      try {
        const res = await axiosInstance.post("/auth/logout");

        if (res.data) {
          set({ credentials: null });
          localStorage.removeItem("credentials");
          window.location.replace("/admin");
        }
      } catch (error) {
        toastErrorMessage("Logout failed");
      }
    },
  },
}));
export const useAuth = () => useAuthStore((state) => state.credentials);

export const useAuthActions = () => useAuthStore((state) => state.actions);
