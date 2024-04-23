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
import Rating from "@/components/Rating";
import { User } from "@/types/User.type";
import { useUserStore } from "@/store/user-store";
import { Solicitud } from "@/types/Solicitud";

export default function PlanScreen() {
  const insets = useSafeAreaInsets();

  const [planData, setPlanData] = useState<Plan>({} as Plan);
  const [liked, setLiked] = useState<boolean>(false);
  const [guests, setGuests] = useState<User[]>([] as User[]);
  const [admin, setAdmin] = useState<User>({} as User);
  const [planAdded, setPlanAdded] = useState<boolean>(false);

  const { uid } = useLocalSearchParams();

  const [refreshData, setRefreshData] = useState(0); // Añade este estado



  const nuevoAsistente = async () => {
    const userId = useUserStore.getState().uid;
    const planId = planData.uid;
    //console.log(userId + " " + planId);

    const planRef = doc(db, "Planes", planId);

    try {
      // Actualiza el campo 'guests' añadiendo el 'userId' a la lista
      await updateDoc(planRef, {
        guests: arrayUnion(userId)
      });
      console.log("Asistente añadido con éxito");
      setRefreshData((prev) => prev + 1); // Incrementa el contador para refrescar datos
    } catch (error) {
      console.error("Error añadiendo asistente: ", error);
    }

    // const q = query(collection(db, "Planes"), where("uid", "==", uid));
    // const querySnapshot = await getDocs(q);
    // const plans = querySnapshot.docs.map(doc => doc.data() as Plan);
  }

  const borrarAsistente = async () => {
    const userId = useUserStore.getState().uid;
    const planId = planData.uid;

    const planRef = doc(db, "Planes", planId);

    try {
      // Actualiza el campo 'guests' borrando el 'userId' a la lista
      await updateDoc(planRef, {
        guests: arrayRemove(userId)
      });
      console.log("Asistente borrado con éxito");
      setPlanAdded(false);
      setRefreshData((prev) => prev + 1); // Incrementa el contador para refrescar datos
    } catch (error) {
      console.error("Error borrando asistente: ", error);
    }
  }

  const getPlanData = async () => {
    const userId = useUserStore.getState().uid;
    try {
      const q = query(collection(db, "Planes"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map(doc => doc.data() as Plan);
      if (plans.length > 0) {
        const planData = plans[0];
        console.log(planData);
        setPlanData(planData);

        const guestsData: User[] = [];
        for (const guestId of planData.guests) {
          if (guestId === userId)
            setPlanAdded(true);
          const docRef = doc(db, "Usuarios", guestId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            guestsData.push(docSnap.data() as User);
          }
        }
        setGuests(guestsData);

        let adminData : User = {} as User;
        const docRef = doc(db, "Usuarios", planData.idAdmin);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Admin data:", docSnap.data());
          adminData = docSnap.data() as User;
        }
        setAdmin(adminData);
        console.log(admin)
        const idAdmins = querySnapshot.docs.map(doc => doc.data().idAdmin);
        console.log(planData.idAdmin);
        console.log(admin.uid);
        if (admin.uid == planData.idAdmin){
          console.log(admin.uid);
        }

      }
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

 
  const getUsersData = async () => {
    try {
        const q = query(collection(db, "Usuarios"), where("uid", "in", setSolicitudes));
        const querySnapshot = await getDocs(q);
        const userData: Solicitud[] = querySnapshot.docs.map((doc) => ({
            idUsuario: doc.id,
            avatar: doc.data().avatar,
            // Suponiendo que tienes los campos "firstName" y "lastName" en tus documentos de usuario
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            planId: planData.uid
        }));
        setSolicitudes(userData);
        setIsLoading(false);
    } catch (error) {
        console.error("Error getting users data: ", error);
    }
};


     // const q = query(collection(db, "Planes"), where("uid", "==", uid));
    // const querySnapshot = await getDocs(q);
    // const plans = querySnapshot.docs.map(doc => doc.data() as Plan);


  useEffect(() => {
    setPlanData({} as Plan); // Reinicia los datos del plan si es necesario
    getPlanData(); // Obtiene los datos del plan nuevamente, incluyendo los nuevos asistentes
  }, [uid, refreshData]); // Dependencia adicional a refreshData

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <Image source={{ uri: planData?.picture }} style={styles.planImage} />
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <BlurView intensity={100} style={styles.blurContainer}>
            <Ionicons name="arrow-back" size={24} color="#fffdfd" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push(`/user/${admin?.uid}`)}>
          {admin ? (
            <Image
              source={{ uri: (admin?.avatar) as string }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,

              }}/>
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
        {/* <TouchableOpacity onPress={() => setLiked(!liked)}>
          <BlurView intensity={60} style={styles.blurContainer} tint="dark">
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#EF4F5D" : "#fffdfd"}
            />
          </BlurView>
        </TouchableOpacity> */}
      </View>
      <ScrollView style={{ flex: 1 }}>
      <View style={styles.spacer} />
      <View style={styles.contentCard}>
        <Text style={styles.titleCard}>{planData.name}</Text>
        <Rating size={24} />
        <Text style={styles.subTitleCard}>Detalles</Text>
        <Text style={styles.cardDate}>
          {new Date((planData.dateStart?.seconds as number) * 1000).toLocaleDateString()}
          {" - "}
          {new Date((planData.dateEnd?.seconds as number) * 1000).toLocaleDateString()}
        </Text>
        <Text style={styles.cardDescription}>{planData.description}</Text>
        {planData.labels && (
          <View style={styles.labelsContainer}>
            {planData.labels.map((label: string, index: number) => (
              <View key={index} style={styles.labelContainer}>
                <Text style={styles.labelText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.cardDivider} />
        <Text style={styles.subTitleCard}>{guests.length} Asistentes</Text>

        <ScrollView horizontal>
          {guests.map((guest, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => router.push(`/user/${guest?.uid}`)}>
                <Image
                  key={`guest-avatar-${index}`}
                  source={{
                    uri: (guest?.avatar ||
                      `https://ui-avatars.com/api/?name=${
                        guest?.firstName.split(" ")[0]
                      }+${
                        guest?.lastName.split(" ")[0]
                      }&background=random&color=fff`) as string,
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>
            );
          })}


        </ScrollView>
        <View style={styles.container2}>
          {planData.idAdmin != useUserStore.getState().uid ? (
            planAdded === false ? (
              <Pressable style={styles.button} onPress={nuevoAsistente}>
                <Text style={styles.textButton}>Apuntarme</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.button} onPress={borrarAsistente}>
                <Text style={styles.textButton}>Salir del plan</Text>
              </Pressable>
            )
          ) : 
          admin.uid == planData.idAdmin ? (
              <Pressable style={styles.button} onPress={() => router.push(`/solicitudes/${planData.uid}`)}>
              <Text style={styles.textButton}>Solicitudes</Text>
              </Pressable>
            ) : null}
        </View>

        <View style={styles.container}>

        </View>
        
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
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Aseguramos que el texto sea blanco para mejor contraste
  },
});
function setSolicitudes(userData: Solicitud[]) {
  throw new Error("Function not implemented.");
}

function setIsLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

