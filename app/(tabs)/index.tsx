import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomePage = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido 👋</Text>
      </View>
      <Text>Soy un texto</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
  },
  header: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default HomePage;
