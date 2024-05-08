import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/store/user-store";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./_infrastructure/firebase";
import Button from "@/components/Button";

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const update = useUserStore((state) => state.update);

  const handleLogin = async () => {
    setIsLoading(true);
    signInWithEmailAndPassword(getAuth(), email, password)
      .then(async (user: any) => {
        if (user) {
          const uid = await user.user.uid;
          // console.log(uid, "🟠 UID");
          try {
            const q = query(
              collection(db, "Usuarios"),
              where("uid", "==", uid)
            );
            await getDocs(q).then((response) => {
              // console.log("🟠 RESPONSE", response.docs);
              if (response.docs.length === 0) {
                alert("Usuario no encontrado");
                throw new Error("Usuario no encontrado");
              }
              response.docs.map(async (data) => {
                update({
                  uid,
                  email: await data.data().email,
                  labels: await data.data().labels,
                  registered: await data.data().registered,
                  firstName: await data.data().firstName,
                  lastName: await data.data().lastName,
                  dateBirth: await data.data().dateBirth,
                  score: await data.data().score,
                  direcciones: await data.data().direcciones,
                  gender: await data.data().gender,
                  avatar: await data.data().avatar,
                });
              });
            });
          } catch (error) {
            console.log("🔴 ERROR", error);
          }
          router.replace("/(tabs)");
          // console.log("🟠Async Storage:", await AsyncStorage.getAllKeys());
        }
      })
      .catch((err) => {
        alert(err?.message);
      })
      .finally(() => setIsLoading(false));
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
          <Button
            title="Login"
            onPress={handleLogin}
            disabled={false}
            loading={isLoading}
            variant="filled"
            size="medium"
            rounded={false}
            fullWidth
          />
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
