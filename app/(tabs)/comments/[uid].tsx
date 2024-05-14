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
  ActivityIndicator,
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
import { Valoracion } from "@/types/Valoracion.type";
import { useUserStore } from "@/store/user-store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import LoadingView from "@/layout/LoadingView";

export default function CommentScreen() {
  const insets = useSafeAreaInsets();

  const [planData, setPlanData] = useState<Plan>({} as Plan);
  const [comments, setComments] = useState<Valoracion[]>([] as Valoracion[]);
  const [admin, setAdmin] = useState<User>({} as User);
  const [users, setUsers] = useState<User[]>([] as User[]);
  const [planAdded, setPlanAdded] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [ratingValue, setRatingValue] = useState(0);
  const [commentAdded, setCommentAdded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { uid } = useLocalSearchParams();

  const [refreshData, setRefreshData] = useState(0);

  const handleRatingChange = (newValue: number) => {
    setRatingValue(newValue); // Actualizamos el estado en la clase padre
  };

  const updatePlanScore = async () => {
    const planId = planData.uid;

    try {
      const qVal = query(
        collection(db, "Valoraciones"),
        where("idPlan", "==", planId)
      );
      const querySnapshotVal = await getDocs(qVal);
      const valoraciones = querySnapshotVal.docs.map(
        (doc) => doc.data() as Valoracion
      );

      let score = 0;
      for (const valoracion of valoraciones)
        score += valoracion.score as number;
      score /= valoraciones.length;

      const planDocRef = doc(db, "Planes", planId);
      await setDoc(planDocRef, { score: score }, { merge: true });
      setRefreshData(refreshData + 1); // Incrementa el estado para forzar la recarga de datos
      updateAdminScore();
    } catch (error) {
      console.log("🔴 ERROR: Error getting documents:", error);
    }
  };

  const updateAdminScore = async () => {
    const adminId = planData.idAdmin;
    const planId = planData.uid;

    try {
      const qVal = query(
        collection(db, "Valoraciones"),
        where("idPlan", "==", planId)
      );
      const querySnapshotVal = await getDocs(qVal);
      const valoraciones = querySnapshotVal.docs.map(
        (doc) => doc.data() as Valoracion
      );

      let score = 0;
      for (const valoracion of valoraciones)
        score += valoracion.score as number;
      score /= valoraciones.length;

      const userDocRef = doc(db, "Usuarios", adminId);
      await setDoc(userDocRef, { score: score }, { merge: true });
    } catch (error) {
      console.log("🔴 ERROR: Error getting documents:", error);
    }
  };

  const addComment = async () => {
    const userId = useUserStore.getState().uid;
    const planId = planData.uid;

    try {
      const uid4 = uuidv4();

      if (ratingValue != 0) {
        const userDocRef = doc(db, "Valoraciones", uid4); // Crea una referencia al documento usando el uid del usuario
        try {
          await setDoc(userDocRef, {
            idPlan: planId,
            idUsuario: userId,
            score: ratingValue,
            description: description,
            uid: uid4,
          });
          // console.log("user.user.uid: ", uid4);
          setDescription("");
          setRatingValue(0);
          setCommentAdded(true);
          updatePlanScore();
          planData.score = ratingValue;
          setRefreshData(refreshData + 1); // Incrementa el estado para forzar la recarga de datos
        } catch (e) {
          console.log("🔴 ERROR: Error adding document:", e);
        }
      } else {
        alert("Debes valorar el plan para poder comentar");
      }
    } catch (error) {
      console.log("🔴 ERROR: Error getting uid:", error);
    }
  };

  const getPlanData = async () => {
    const userId = useUserStore.getState().uid;
    try {
      const q = query(collection(db, "Planes"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map((doc) => doc.data() as Plan);
      if (plans.length > 0) {
        const planData = plans[0];
        // console.log(planData);
        setPlanData(planData);

        for (const guestId of planData.guests)
          if (guestId === userId) setPlanAdded(true);

        let adminData: User = {} as User;
        const docRef = doc(db, "Usuarios", planData.idAdmin);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Admin data:", docSnap.data());
          adminData = docSnap.data() as User;
          if (adminData.uid === userId) setPlanAdded(true);
        }
        setAdmin(adminData);
        // console.log(admin);
      }

      const qVal = query(
        collection(db, "Valoraciones"),
        where("idPlan", "==", uid)
      );
      const querySnapshotVal = await getDocs(qVal);
      const valoraciones = querySnapshotVal.docs.map(
        (doc) => doc.data() as Valoracion
      );

      const userData: User[] = [];
      for (const idUsuario of valoraciones.map(
        (valoracion) => valoracion.idUsuario
      )) {
        const docRef = doc(db, "Usuarios", idUsuario as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          userData.push(docSnap.data() as User);
          if (idUsuario === userId) setCommentAdded(true);
        }
      }
      setUsers(userData);
      // console.log("Users:", userData);
      setComments(valoraciones);
      // console.log("Valoraciones:", valoraciones);
      setIsLoading(false);
    } catch (error) {
      console.log("🔴 ERROR: Error getting documents:", error);
    }
  };

  useEffect(() => {
    setPlanData({} as Plan); // Reinicia los datos del plan si es necesario
    setCommentAdded(false); // Reinicia el indicador de comentario añadido
    setPlanAdded(false); // Reinicia el indicador de plan añadido
    setIsLoading(true); // Muestra el indicador de carga
    getPlanData(); // Obtiene los datos del plan nuevamente, incluyendo los nuevos asistentes
  }, [uid, refreshData]); // Dependencia adicional a refreshData

  return (
    <View>
      {isLoading ? (
        // <View
        //   style={[
        //     {
        //       paddingTop: insets.top,
        //       justifyContent: "center",
        //       alignItems: "center",
        //       height: "100%",
        //     },
        //   ]}
        // >
        //   <ActivityIndicator size="large" color="#FF9500" />
        //   <Text style={{ marginTop: 10 }}>Cargando comentarios...</Text>
        // </View>
        <LoadingView text="Cargando comentarios..." />
      ) : (
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <Image source={{ uri: planData?.picture }} style={styles.planImage} />
          <View style={styles.navContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <BlurView intensity={100} style={styles.blurContainer}>
                <Ionicons name="arrow-back" size={24} color="#fffdfd" />
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/user/${admin?.uid}`)}
            >
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
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.scoreNumber}>
                  {planData.score.toFixed(2)}
                </Text>
                <Rating size={20} value={planData.score as number} />
              </View>
              <View style={styles.cardDivider} />

              <View>
                {planAdded ? (
                  !commentAdded ? (
                    <View>
                      <Text style={styles.subTitleCard}>Valora el plan!😊</Text>
                      <View style={styles.addCommentContainer}>
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: 5,
                            marginTop: 5,
                            padding: 5,
                          }}
                        >
                          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            Valoración:{" "}
                          </Text>
                          <AddRating
                            size={20}
                            onChangeValue={handleRatingChange}
                          />
                        </View>
                        <View style={{ marginLeft: 5, padding: 5 }}>
                          <TextInput
                            id="descripcion"
                            style={styles.commentDescription}
                            placeholder="Escribe tú comentario..."
                            onChangeText={setDescription}
                            value={description}
                            multiline={true}
                            scrollEnabled={true}
                            numberOfLines={3}
                          />
                        </View>
                        <View style={{ alignItems: "center" }}>
                          <Pressable style={styles.button} onPress={addComment}>
                            <Text style={styles.textButton}>
                              Añadir comentario
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.notCommentText}>
                      Gracias por tu valoración!🫶
                    </Text>
                  )
                ) : (
                  <Text style={styles.notCommentText}>
                    Solo pueden añadir comentarios los asistentes del plan
                  </Text>
                )}
              </View>
              <View style={styles.cardDivider} />
              <Text style={styles.subTitleCard}>
                {comments.length} Comentarios
              </Text>
              {comments.length > 0 && users.length == comments.length ? (
                <ScrollView>
                  {comments.map((comment, index) => {
                    return (
                      <View key={index} style={styles.commentContainer}>
                        <TouchableOpacity
                          key={`comment-touch-${index}`}
                          onPress={() =>
                            router.push(`/user/${comment?.idUsuario}`)
                          }
                        >
                          <Image
                            key={`comment-${index}`}
                            source={{
                              uri: users[index].avatar as string,
                            }}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 30,
                              marginRight: 10,
                            }}
                          />
                        </TouchableOpacity>
                        <View style={styles.commentInfo}>
                          <Text style={styles.commentNameText}>
                            {users[index].firstName} {users[index].lastName}
                          </Text>
                          <Rating size={15} value={comment?.score as number} />
                          <Text style={styles.commentDescription}>
                            {comment?.description}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text style={styles.notCommentText}>
                  No hay comentarios disponibles
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      )}
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
    opacity: 0.5, // Set opacity to make it more transparent
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
  commentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    textAlign: "justify",
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
  commentContainer: {
    flexDirection: "row",
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FDF2E9",
  },
  commentInfo: {
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    width: "75%",
  },
  commentNameText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  addCommentContainer: {
    borderColor: "#FDF2E9",
    borderRadius: 10,
    borderWidth: 3,
  },
  notCommentText: {
    fontSize: 15,
    marginBottom: 5,
    color: "#666",
  },
  container2: {
    flex: 1, // Usa flex para que el contenedor se expanda
    alignContent: "center", // Alinea el contenido al centro
  },
  button: {
    backgroundColor: "#FF9500", // Cambiado a un naranja más vibrante
    borderRadius: 60, // Bordes más redondeados para un look moderno
    height: 35,
    width: "55%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
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
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF", // Aseguramos que el texto sea blanco para mejor contraste
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
});
