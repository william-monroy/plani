import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ImagePicker } from 'expo-image-picker';

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "@/types/Plan.type";
import { PlanCard } from "@/components/PlanCard";


const UsersPage = () => {
  const insets = useSafeAreaInsets();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


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

    if (!result.cancelled) {
      setSelectedImage(result.uri);
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
        {selectedImage && <Image source={{ uri: selectedImage }}/>}
        <Button title="Pick Image" onPress={pickImage} />
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
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  plans: {
    display: "flex",
    gap: 10,
  },
});

export default UsersPage;
