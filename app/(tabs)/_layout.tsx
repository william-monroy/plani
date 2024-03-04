import { Tabs, router } from "expo-router";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { Text } from "react-native";
import { Octicons } from "@expo/vector-icons";

const TabsLayout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  getAuth().onAuthStateChanged((user) => {
    setIsLoading(false);
    if (!user) {
      router.replace("/landing");
    }
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Buscar",
          tabBarIcon: ({ color }) => (
            <Octicons name="search" size={24} color={"red"} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          headerTitle: "Users Regsitered",
          title: "Planes",
        }}
      />
      <Tabs.Screen
        name="user/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",
          title: "Settings",
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
