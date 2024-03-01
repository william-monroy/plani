import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { LinearGradient } from "expo-linear-gradient";

const RegisterScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace("/(tabs)");
      })
      .catch((err) => {
        alert(err?.message);
      });

    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: email,
        registered: new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 1.5, y: 1.5 }}
        end={{ x: 0, y: 0 }}
        colors={['white', '#FFD700', '#FF6347']}
        style={styles.gradient}
      ><Text style={styles.title}>¿Aún no has creado una cuenta?</Text>
        <View style={styles.form}>
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
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.textButton}>Register</Text>
          </Pressable>
          <Text style={styles.text} onPress={() => router.push("/login")}>¿Ya tienes una cuenta?</Text>  

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
    backgroundColor: "#f9f9f9",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: "80%",
    
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 180,
    color: "#121212",
  },form: {
    width: "80%",
    marginTop: 50,
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
    color: "#f6f6f6",
    fontSize: 19,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default RegisterScreen;
