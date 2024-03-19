import { Plan } from "@/types/Plan.type";
import { GeoPoint } from "firebase/firestore";
import { create } from "zustand";

export interface PlansStore extends Plan {
  plans: Plan[];
  update: (plans: Plan[]) => void;
  add: (plan: Plan) => void;
  remove: (planUid: string) => void;
  getByUid: (planUid: string) => Plan | undefined;
}

export const usePlansStore = create<PlansStore>()((set, get) => ({
  coordinates: new GeoPoint(0, 0),
  dateEnd: undefined,
  dateStart: undefined,
  description: "",
  guests: [],
  idAdmin: "",
  idDireccion: "",
  idValoracion: "",
  labels: [],
  name: "",
  picture: "",
  requests: [],
  score: 0,
  uid: "",

  plans: [],
  update: (plans) => set({ plans }),
  add: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
  remove: (planUid) =>
    set((state) => ({
      plans: state.plans.filter((plan) => plan.uid !== planUid),
    })),
  getByUid: (planUid) => get().plans.find((plan) => plan.uid === planUid),
}));
