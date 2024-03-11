import { User } from "@/types/User.type";
import { create } from "zustand";

export interface UserStore extends User {
  update: (user: Partial<User>) => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
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

  update: (user) => set((state) => ({ ...state, ...user })),
}));
