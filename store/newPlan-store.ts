import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Plan } from "@/types/Plan.type";
import { GeoPoint } from "firebase/firestore";
import { zustandNewPlanStorage } from "./asyncNewPlanStorage";
import { Direccion } from "@/types/Direccion.type";

interface StepStatus {
  steps: number;
  current: number;
  direccion: Direccion;
  currentAddress: any;
  setSteps: (steps: number) => void;
  setCurrent: (current: number) => void;
  setDireccion: (direccion: Direccion) => void;
  setCurrentAddress: (currentAddress: any) => void;
  resetValues: () => void;
}

export interface newPlanStore extends Plan {
  update: (plan: Partial<Plan>) => void;
}

export const useNewPlanStore = create<newPlanStore & StepStatus>()(
  persist(
    (set, get) => ({
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
      update: (plan) => set((state) => ({ ...state, ...plan })),

      steps: 4,
      current: 1,
      direccion: {
        alias: "",
        city: "",
        coordinates: new GeoPoint(0, 0),
        idUser: "",
        state: "",
        street: "",
        zipCode: 0,
        uid: "",
      },
      currentAddress: {},
      setSteps: (steps) => set({ steps }),
      setCurrent: (current) => set({ current }),
      setDireccion: (direccion) => set({ direccion }),
      setCurrentAddress: (currentAddress) => set({ currentAddress }),

      resetValues: () => {
        set({
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
          steps: 4,
          current: 1,
          direccion: {
            alias: "",
            city: "",
            coordinates: new GeoPoint(0, 0),
            idUser: "",
            state: "",
            street: "",
            zipCode: 0,
            uid: "",
          },
          currentAddress: {},
        });
      },
    }),
    {
      name: "newPlan-storage",
      storage: createJSONStorage(() => zustandNewPlanStorage),
    }
  )
);
