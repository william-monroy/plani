import { router } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plani</Text>
      <View>
        <Button title="Login" onPress={() => router.push("/login")} />
        <Button title="Register" onPress={() => router.push("/register")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default LandingScreen;
