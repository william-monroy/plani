import AsyncStorage from "@react-native-async-storage/async-storage";
import { StateStorage } from "zustand/middleware";

const id = "user-storage";

export const UserStore = {
  async setItem(key: string, value: string) {
    try {
      let user = JSON.parse((await AsyncStorage.getItem(id)) || "{}");
      if (user) {
        user[key] = value;
        await AsyncStorage.setItem(id, JSON.stringify(user));
      } else {
        await AsyncStorage.setItem(id, JSON.stringify({ [key]: value }));
      }
    } catch (e) {
      console.error(`Error setting item: ${e}`);
    }
  },
  async getItem(key: string) {
    try {
      let user = JSON.parse((await AsyncStorage.getItem(id)) || "{}");
      return user[key];
    } catch (e) {
      console.error(`Error getting item: ${e}`);
    }
  },
  async removeItem(key: string) {
    try {
      let user = JSON.parse((await AsyncStorage.getItem(id)) || "{}");
      delete user[key];
      await AsyncStorage.setItem(id, JSON.stringify(user));
    } catch (e) {
      console.error(`Error removing item: ${e}`);
    }
  },
};

export const zustandUserStorage: StateStorage = {
  setItem: async (key: string, value: string) => {
    return await UserStore.setItem(key, value);
  },
  getItem: async (key: string) => {
    const value = await UserStore.getItem(key);
    return value ?? null;
  },
  removeItem: async (key: string) => {
    return await UserStore.removeItem(key);
  },
};
