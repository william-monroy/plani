import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";
import { Plan } from "@/types/Plan.type";
import { useEffect, useState } from "react";
import Rating from "@/components/UserRating";
import AddRating from "@/components/Rating";
import { User } from "@/types/User.type";
import { Notificacion } from "@/types/Notificacion.type";
import { useUserStore } from "@/store/user-store";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";

//const insets = useSafeAreaInsets();

export default function CommentScreen() {
    //no lo necesito
  const { uid } = useLocalSearchParams();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([] as Notificacion[]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const userId = useUserStore.getState().uid;
  const avatar = useUserStore.getState().avatar;
  
  const getData = async () => {
    try {
      const q = query(collection(db, "Notificaciones"), where("idUsuario", "==", userId));
      const querySnapshot = await getDocs(q);
      const notificaciones = querySnapshot.docs.map((doc) => doc.data() as Notificacion);
      setNotificaciones(notificaciones);
      console.log("Valoraciones:", notificaciones);
      console.log("Id del suario:", userId);
      //setIsLoading(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    setRefreshing(true);
    getData(); // Obtiene los datos del plan nuevamente, incluyendo los nuevos asistentes
    setRefreshing(false);
  }, [uid]);

  return (
    <View style={[{ paddingTop: insets.top }]}>
        <View style={styles.navContainer}>
            <TouchableOpacity onPress={() => router.replace("/")}>
            <BlurView intensity={100} style={styles.blurContainer}>
                <Ionicons name="arrow-back" size={24} color="orange" />
            </BlurView>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push(`/user/${userId}`)}>
                <Image
                source={{ uri: avatar as string }}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                }}
                />
            </TouchableOpacity>
        </View>

        <ScrollView>
        {notificaciones.map((notificacion, index) => (
          <View key={index} style={styles.notificationCard}>
            <Text style={styles.notificationTitle}>{notificacion.titulo}</Text>
            <Text style={styles.notificationMessage}>{notificacion.mensaje}</Text>
          </View>
        ))}
      </ScrollView>

        
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    navContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      alignItems: 'center',
    },
    blurContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      overflow: "hidden",
      justifyContent: "center",
      opacity: 0.7,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: 10,
    },
    notificationCard: {
      backgroundColor: "#F9F9F9",
      borderRadius: 10,
      padding: 15,
      marginVertical: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1.41,
      elevation: 2,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    notificationMessage: {
      fontSize: 14,
      color: "#666",
    },
  });
