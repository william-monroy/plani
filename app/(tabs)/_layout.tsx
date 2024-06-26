import { Tabs, router } from "expo-router";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Text } from "react-native";
import { Octicons } from "@expo/vector-icons";

const TabsLayout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const update = useUserStore((state) => state.update);

  const checkUser = async () => {
    // console.log("🔴authState");
    getAuth().onAuthStateChanged(async (user) => {
      // console.log("user:", user);
      setIsLoading(false);
      if (!user) {
        router.replace("/landing");
      }
    });
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Buscar",
          tabBarIcon: ({ focused }) => (
            <Octicons
              name="search"
              size={24}
              color={focused ? "orange" : "gray"}
            />
          ),
          tabBarLabel(props) {
            return (
              <Text
                style={{
                  color: props.focused ? "orange" : "gray",
                  fontSize: 10,
                }}
              >
                Buscar
              </Text>
            );
          },
        }}
      />
      <Tabs.Screen
        name="plan/[uid]"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="solicitudes/[planId]"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="comments/[uid]"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="notificaciones/[uid]"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="(createPlan)/step1"
        options={{
          title: "Subir",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Octicons
              name="diff-added"
              size={24}
              color={focused ? "orange" : "gray"}
            />
          ),
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="user/[id]"
        options={{
          headerShown: false,
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Octicons
              name="person"
              size={24}
              color={focused ? "orange" : "gray"}
            />
          ),
          tabBarLabel(props) {
            return (
              <Text
                style={{
                  color: props.focused ? "orange" : "gray",
                  fontSize: 10,
                }}
              >
                Buscar
              </Text>
            );
          },
        }}
      />
      <Tabs.Screen
        name="(createPlan)/step2"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="(createPlan)/step3"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
      <Tabs.Screen
        name="(createPlan)/step4"
        options={{
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
