

import React, { useState, useEffect } from "react";
import { View, Button, Text, Image, FlatList, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";

const SettingsPage = () => {
  // Datos del usuario (simulados)
  const user = {
    name: "Nombre",
    email: "nombre@example.com",
    photoUrl: "https://example.com/profile.jpg",
    bio: "¡Hola! Soy xxxx, blblblbblablalbalbalblabal."
  };

  return (
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