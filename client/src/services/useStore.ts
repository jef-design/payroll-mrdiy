import { create } from "zustand";
import { persist } from "zustand/middleware";

// User type
interface User {
  EEID: string;
  email: string;
  name: string;
  join_date: string
  leaveCredits: string
  position: string
  department: string
}

// Store type
interface UserState {
  user: User | null;
  setLogInUser: (userInfo: User) => void;
  setLogOutUser: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setLogInUser: (userInfo) =>
        set({ user: userInfo }),

      setLogOutUser: () =>
        set({ user: null }),
    }),
    {
      name: "employee-user", // storage key
      // storage defaults to localStorage
    }
  )
);
