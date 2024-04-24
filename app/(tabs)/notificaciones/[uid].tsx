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
  const [key, setKey] = useState(0); // Estado inicial para la clave
  const insets = useSafeAreaInsets();
  const userId = useUserStore.getState().uid;
  const avatar = useUserStore.getState().avatar;
  
  const getData = async () => {
    try {
      console.log("Estoy aqui!!!!!!!!-------seffdvgdfg----")
      const q = query(collection(db, "Notificaciones"), where("idUsuario", "==", userId));
      const querySnapshot = await getDocs(q);
      const notificaciones = querySnapshot.docs.map((doc) => doc.data() as Notificacion);
      setNotificaciones(notificaciones);
      console.log("Notificcaciones:", notificaciones);
      console.log("Id del suario:", userId);
      //setIsLoading(false);

      querySnapshot.docs.forEach(docSnapshot => {
        const notificacion = docSnapshot.data() as Notificacion;
        if (!notificacion.leida) {
          const notificacionRef = doc(db, "Notificaciones", docSnapshot.id);
          setDoc(notificacionRef, { leida: true }, { merge: true })
            .then(() => console.log(`Notificación ${docSnapshot.id} marcada como leída`))
            .catch(error => console.error(`Error al actualizar la notificación ${docSnapshot.id}: `, error));
        }
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const handleBackButtonClick = () => {
    setKey(prev => prev + 1); // Incrementa la clave para forzar el remontaje
    router.replace("/"); // O cualquier navegación que realices
  };

  const onRefresh = () => {
    setRefreshing(true);
    getData(); 
    setRefreshing(false);
  };

  useEffect(() => {
    //setRefreshing(true);
    getData(); // Obtiene los datos del plan nuevamente, incluyendo los nuevos asistentes
    //setRefreshing(false);
  }, [key]);

  return (
    <View key={key} style={[{ paddingTop: insets.top }]}>
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

        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
        {notificaciones.map((notificacion, index) => {
          console.log("Notificacion: ", notificacion);
          console.log(`Notificación ${index} leída:`, notificacion.leida, notificacion.idUsuario);  // Esto imprimirá si cada notificación está leída o no
          return notificacion.leida ? (
            <View key={index} style={styles.notificationCard}>
              <Text style={styles.notificationTitle}>{notificacion.titulo}</Text>
              <Text style={styles.notificationMessage}>{notificacion.mensaje}</Text>
            </View>
          ) : (
            <View key={index} style={styles.notificationCardUnread}>
              <Text style={styles.notificationTitle}>{notificacion.titulo}</Text>
              <Text style={styles.notificationMessage}>{notificacion.mensaje}</Text>
            </View>
          );
        })}
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
      //backgroundColor: "black",
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
    notificationCardUnread: {
      backgroundColor: "#FDF2E9",
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
