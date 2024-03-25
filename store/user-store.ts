import { User } from "@/types/User.type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./asyncStorage";

export interface UserStore extends User {
  update: (user: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      dateBirth: undefined,
      direcciones: [],
      email: "",
      firstName: "",
      lastName: "",
      gender: undefined,
      labels: [],
      score: 0,
      uid: "",
      registered: undefined,
      avatar: "",

      update: (user) => set((state) => ({ ...state, ...user })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
