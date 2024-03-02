import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const RegisterScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then(async (user) => {
        if (user) {
          try {
            const docRef = await addDoc(collection(db, "users"), {
              email: email,
              registered: new Date().toISOString(),
              uid: user.user.uid,
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          router.replace("preferences");
        }
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RegisterScreen</Text>
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
        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.textButton}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    // justifyContent: "",
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

export default RegisterScreen;
