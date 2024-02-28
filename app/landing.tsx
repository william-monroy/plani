import { router } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";

const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plani</Text>
      <View style={styles.buttons}>
        <Button title="Login" color="orange" onPress={() => router.push("/login")} />
        <Button title="Register" color="orange" onPress={() => router.push("/register")} />
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
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
  },
});

export default LandingScreen;
