import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

const id = "newPlan-storage";

export const NewPlanStore = {
  async setItem(key: string, value: string) {
    try {
      let plan = JSON.parse((await AsyncStorage.getItem(id)) || "{}");
      if (plan) {
        plan[key] = value;
        await AsyncStorage.setItem(id, JSON.stringify(plan));
      } else {
        await AsyncStorage.setItem(id, JSON.stringify({ [key]: value }));
      }
    } catch (e) {
      console.error(`Error setting item: ${e}`);
    }
  },
  async getItem(key: string) {
    try {
      let plan = JSON.parse((await AsyncStorage.getItem(id)) || "{}");
      return plan[key];
    } catch (e) {
      console.error(`Error getting item: ${e}`);
    }
  },
  async removeItem(key: string) {
    try {
      let plan = JSON.parse((await AsyncStorage.getItem(id)) || "{}");
      delete plan[key];
      await AsyncStorage.setItem(id, JSON.stringify(plan));
    } catch (e) {
      console.error(`Error removing item: ${e}`);
    }
  },
};

export const zustandNewPlanStorage: StateStorage = {
  setItem: async (key: string, value: string) => {
    return await NewPlanStore.setItem(key, value);
  },
  getItem: async (key: string) => {
    const value = await NewPlanStore.getItem(key);
    return value ?? null;
  },
  removeItem: async (key: string) => {
    return await NewPlanStore.removeItem(key);
  },
};
