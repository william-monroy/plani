

import React, { useState, useEffect } from "react";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";
import { View, Button, Text, Image, FlatList, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types/User.type";

const SettingsPage = () => {
  const { firstName, email } = useUserStore.getState();
  
  // // Datos del usuario (simulados)
  // const user = {
  //   name: firstName,
  //   email: email,
  //   photoUrl: "https://example.com/profile.jpg",
  //   bio: "¡Hola! Soy xxxx, blblblbblablalbalbalblabal."
  // };

  const getData = async () => {
    const collectionRef = collection(db, "Usuarios");
    
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

    await onSnapshot(collectionRef, async (data) => {
      setUsuarios(
        await data.docs.map((item) => {
          const userData = { ...item.data(), id: item.id } as unknown;
          return userData as User;
        })
      );
      console.log("Users updated", JSON.stringify(usuarios, null, 2));
      setIsLoading(false);
    });

    useEffect(() => {
      getData();
      console.log("re-render");
    }, []);

  return (
    // {isLoading ? (
    //   <Text>Loading users...</Text>
    // ) : (
    //   {usuarios.map((plan: Plan, key: number) => (
    <View style={styles.container}>
      {/* Foto y nombre del usuario */}
      <View style={styles.userInfo}>
        <Image source={{ uri: user.photoUrl }} style={styles.userPhoto} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      {/* Correo electrónico */}
      <Text style={styles.label}>Correo electrónico:</Text>
      <Text style={styles.info}>{user.email}</Text>

      {/* Biografía */}
      <Text style={styles.label}>Biografía:</Text>
      <Text style={styles.info}>{user.bio}</Text>
    
      {/* Botón de Cerrar sesión */}
      <Button title="Cerrar sesión" onPress={async () => await signOut(getAuth())} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold"
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },
  info: {
    fontSize: 16
  },button: {
    backgroundColor: "#FF9500", // Cambiado a un naranja más vibrante
    borderRadius: 60, // Bordes más redondeados para un look moderno
    height: 40,
    width: "75%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: "30%",
    marginBottom: 20,
    shadowColor: "#000", // Sombra para dar profundidad
    shadowOffset: {
      width: 0,
      height: 4, // Ajustamos la altura para que la sombra sea más notable
    },
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Difuminado de la sombra
    elevation: 8, // Elevación para Android, aumentada para mayor sombra
  }
});
export default SettingsPage;