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
          tabBarIcon: ({ focused }) => (
            <Octicons name="search" size={24} color={focused ? "orange" : "gray"} />
          ),
        }}
      />
      <Tabs.Screen
        name="newPlan"
        options={{
          title: "Subir",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Octicons name="diff-added" size={24} color={focused ? "orange" : "gray"}  />
          ),
        }}
      />
      <Tabs.Screen
        name="user/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "Perfil",
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Octicons name="person" size={24} color={focused ? "orange" : "gray"}  />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
