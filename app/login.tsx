import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
      <LinearGradient
        start={{ x: 1.5, y: 1.5 }}
        end={{ x: 0, y: 0 }}
        colors={["white", "#FFD700", "#FF6347"]}
        style={styles.gradient}
      >
        <Text style={styles.title}>Iniciar Sesión</Text>
        <View style={styles.form}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese su correo"
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.label}>Contraseña</Text>

          <TextInput
            style={styles.input}
            placeholder="Ingrese su contraseña"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.textButton}>Login</Text>
          </Pressable>
          <Text style={styles.text} onPress={() => router.push("/register")}>
            Crear una cuenta
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    width: "80%",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 180,
    color: "#121212",
  },
  form: {
    width: "80%",
    marginTop: 50,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#121212",
  },
  input: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 15,
    marginBottom: 20,
    color: "#121212",
  },
  button: {
    backgroundColor: "#f5a623",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f6f6f6",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    color: "#542500",
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default LoginScreen;
