import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="landing"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            presentation: "modal",
            //presentationTitle: "Regístrate",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
};

export default RootLayout;
