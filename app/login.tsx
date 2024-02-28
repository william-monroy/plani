import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace("/(tabs)");
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LoginScreen</Text>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.textButton}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 180,
  },
  input: {
    margin: 15,
  },
  button: {
    marginTop: 20,
    width: 120,
    height: 40,
    backgroundColor: "#1283d4",
    borderRadius: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "#f6f6f6",
    fontSize: 19,
    fontWeight: "700",
  },
});

export default LoginScreen;
