import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Button, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "@/types/Plan.type";
import { PlanCard } from "@/components/PlanCard";


const UsersPage = () => {
  const insets = useSafeAreaInsets();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  
  const getData = async () => {
    const collectionRef = collection(db, "Planes");

    await onSnapshot(collectionRef, async (data) => {
      console.log("data", await data.docs);
      setPlanes(
        await data.docs.map((item) => {
          const planData = { ...item.data(), id: item.id } as unknown;
          return planData as Plan;
        })
      );
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        //setSelectedImage(result.uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };


  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Añade un nuevo plan!
        </Text>
      </View>
      <View style={styles.container2}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.textButton}>Pick Image</Text>
        </Pressable>
      </View>
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
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container2: {
    flex: 1, // Usa flex para que el contenedor se expanda
    justifyContent: 'center', // Centra los elementos hijos verticalmente
    alignItems: 'center', // Centra los elementos hijos horizontalmente
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  plans: {
    display: "flex",
    gap: 10,
  },
  button: {
    backgroundColor: "#FF9500", // Cambiado a un naranja más vibrante
    borderRadius: 50, // Bordes más redondeados para un look moderno
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    shadowColor: "#000", // Sombra para dar profundidad
    shadowOffset: {
      width: 0,
      height: 4, // Ajustamos la altura para que la sombra sea más notable
    },
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Difuminado de la sombra
    elevation: 8, // Elevación para Android, aumentada para mayor sombra
  },

  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Aseguramos que el texto sea blanco para mejor contraste
  },
  image: {
    width: 200, 
    height: 200,
    resizeMode: 'contain',
    borderWidth: 2, // Añade un borde con un grosor de 2
    borderColor: '#ddd', // El color del borde
    borderRadius: 10, // Bordes redondeados con un radio de 10
    shadowColor: "#000", // Color de la sombra
    shadowOffset: { // Offset de la sombra
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de difusión de la sombra
    
    elevation: 5, // Elevación para Android que también añade una sombra
  },
});

export default UsersPage;
