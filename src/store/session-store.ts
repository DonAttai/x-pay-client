import { create } from "zustand";

interface SessionState {
  isSessionExpired: boolean;

  actions: {
    setSessionExpired: (expired: boolean) => void;
  };
}

export const useSessionStore = create<SessionState>()((set) => ({
  isSessionExpired: false,
  actions: {
    setSessionExpired: (expired: boolean) => set({ isSessionExpired: expired }),
  },
}));

export const useSession = () =>
  useSessionStore((state) => state.isSessionExpired);
export const useSessionActions = () =>
  useSessionStore((state) => state.actions);
