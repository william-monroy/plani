import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
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
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";
import { Plan } from "@/types/Plan.type";
import { useEffect, useState } from "react";
import Rating from "@/components/UserRating";
import { User } from "@/types/User.type";
import { Valoracion } from "@/types/Valoracion.type";

export default function PlanScreen() {
  const insets = useSafeAreaInsets();

  const [planData, setPlanData] = useState<Plan>({} as Plan);
  const [comments, setComments] = useState<Valoracion[]>([] as Valoracion[]);
  const [admin, setAdmin] = useState<User>({} as User);
  const [avatar, setAvatar] = useState<string>("");

  const { uid } = useLocalSearchParams();

  const [refreshData, setRefreshData] = useState(0); // Añade este estado

  const getAvatar = async (uid: string) => {
    console.log("Getting avatar for user:", uid);
    const q = query(collection(db, "Usuarios"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map((doc) => doc.data() as User);
    if (users.length > 0) {
        const user = users[0];
        console.log("User:", user);
        setAvatar(user.avatar as string);
    }
  }

  const getPlanData = async () => {
    try {
      let q = query(collection(db, "Planes"), where("uid", "==", uid));
      let querySnapshot = await getDocs(q);
      let plans = querySnapshot.docs.map((doc) => doc.data() as Plan);
      if (plans.length > 0) {
        const planData = plans[0];
        console.log(planData);
        setPlanData(planData);

        let adminData: User = {} as User;
        const docRef = doc(db, "Usuarios", planData.idAdmin);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Admin data:", docSnap.data());
          adminData = docSnap.data() as User;
        }
        setAdmin(adminData);
        console.log(admin);
      }

      q = query(collection(db, "Valoraciones"), where("idPlan", "==", uid));
      querySnapshot = await getDocs(q);
      const valoraciones = querySnapshot.docs.map((doc) => doc.data() as Valoracion);
      setComments(valoraciones);
      console.log("Valoraciones:", valoraciones);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    setPlanData({} as Plan); // Reinicia los datos del plan si es necesario
    getPlanData(); // Obtiene los datos del plan nuevamente, incluyendo los nuevos asistentes
  }, [uid, refreshData]); // Dependencia adicional a refreshData

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <Image source={{ uri: planData?.picture }} style={styles.planImage} />
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => router.push(`/plan/${uid}`)}>
          <BlurView intensity={100} style={styles.blurContainer}>
            <Ionicons name="arrow-back" size={24} color="#fffdfd" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/user/${admin?.uid}`)}>
          {admin ? (
            <Image
              source={{ uri: admin?.avatar as string }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
          ) : (
            <Image
              source={require("../../../assets/avatar.jpg")}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.spacer} />
        <View style={styles.contentCard}>
          <Text style={styles.titleCard}>{planData.name}</Text>
          <View style={styles.cardDivider} />
          <Text style={styles.subTitleCard}>{comments.length} Comentarios</Text>

          <ScrollView>
            {comments.map((user, index) => {
              return (
                <View style={styles.labelsContainer}>
                    <TouchableOpacity
                    key={index}
                    onPress={() => router.push(`/user/${user?.idUsuario}`)}
                    >
                        <Image
                            key={`user-avatar-${index}`}
                            source={{
                                uri: avatar as string,
                            }}
                                style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                marginRight: 10,
                            }}
                        />
                    </TouchableOpacity>
                    <Text>{user?.description}</Text>
                    <Rating size={20} value={user?.score as number} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  navContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  blurContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    flexDirection: "row",
  },
  planImage: {
    width: "100%",
    height: 350,
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
  spacer: {
    height: 200,
  },
  contentCard: {
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    flex: 1,
  },
  titleCard: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitleCard: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
  cardDate: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  labelsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  labelContainer: {
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
  },
  labelText: {
    fontSize: 12,
  },
  container2: {
    flex: 1, // Usa flex para que el contenedor se expanda
    justifyContent: "center", // Centra los elementos hijos verticalmente
    alignItems: "center", // Centra los elementos hijos horizontalmente
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FF9500", // Cambiado a un naranja más vibrante
    borderRadius: 60, // Bordes más redondeados para un look moderno
    height: 45,
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
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Aseguramos que el texto sea blanco para mejor contraste
  },
});
