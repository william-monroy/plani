import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { db, storage } from "../_infrastructure/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  RefreshControl,
  Switch,
  Image,
  TouchableOpacity,
} from "react-native";
import { useUserStore } from "@/store/user-store";
import { User } from "@/types/User.type";
import * as ImagePicker from "expo-image-picker";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Plan } from "@/types/Plan.type";
import Rating from "@/components/UserRating";
import { PlanRowCard } from "@/components/PlanRowCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { parseDate } from "@/utils/Timestamp";
import { Ionicons } from "@expo/vector-icons";

export const ProfilePage = () => {
  const { avatar } = useUserStore.getState();
  const [user, setUser] = useState<User>({} as User);
  const [refreshData, setRefreshData] = useState(0); // Añade este estado
  const [image, setImage] = useState<string>(avatar as string); // Añade este estado
  //const [image, setImage] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isEnabledMyPlans, setIsEnabledMyPlans] = useState(true);
  const toggleSwitchMyPlans = () =>
    setIsEnabledMyPlans((previousState) => !previousState);
  const [isEnabledJoined, setIsEnabledJoined] = useState(true);
  const toggleSwitchJoined = () =>
    setIsEnabledJoined((previousState) => !previousState);

  //desde aqui
  const [routes] = useState([
    { key: "myPlans", title: "Mis Planes" },
    { key: "joinedPlans", title: "Apuntado" },
  ]);

  const insets = useSafeAreaInsets();

  const initialLayout = { width: Dimensions.get("window").width };

  const MyPlansRoute = () => (
    <View style={[styles.scene, { backgroundColor: "#ffffff" }]}>
      <View style={styles.container2_index}>
        {isLoading ? (
          <Text>Loading plans...</Text>
        ) : (
          <ScrollView
            style={styles.plans_index}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >
              <Text>Mostrar planes pasados</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#85C1E9" }}
                thumbColor={isEnabledMyPlans ? "orange" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchMyPlans}
                value={isEnabledMyPlans}
              />
            </View>
            {planes.length > 0 && isEnabledMyPlans
              ? planes
                  .filter((plan: Plan) => plan.idAdmin == (user.uid as string))
                  .map((plan: Plan, key: number) => (
                    // <PlanCard key={key} {...plan} />
                    <PlanRowCard key={key} {...plan} />
                  ))
              : planes
                  .filter((plan: Plan) => plan.idAdmin == (user.uid as string))
                  // .filter((plan: Plan) => new Date((plan.dateEnd?.seconds as number) * 1000) > new Date())
                  .filter(
                    (plan: Plan) =>
                      (parseDate(plan.dateEnd) as Date) > new Date()
                  )
                  .map((plan: Plan, key: number) => (
                    // <PlanCard key={key} {...plan} />
                    <PlanRowCard key={key} {...plan} />
                  ))}
          </ScrollView>
        )}
      </View>
    </View>
  );

  const JoinedPlansRoute = () => (
    <View style={[styles.scene, { backgroundColor: "#ffffff" }]}>
      <View style={styles.container2_index}>
        {isLoading ? (
          <Text>Loading plans...</Text>
        ) : (
          <ScrollView
            style={styles.plans_index}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 10,
                marginBottom: 15,
              }}
            >
              <Text>Mostrar planes pasados</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#85C1E9" }}
                thumbColor={isEnabledJoined ? "orange" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchJoined}
                value={isEnabledJoined}
              />
            </View>
            {planes.length > 0 && isEnabledJoined
              ? planes
                  .filter((plan: Plan) =>
                    plan.guests.includes(user.uid as string)
                  )
                  .map((plan: Plan, key: number) => (
                    // <PlanCard key={key} {...plan} />
                    <PlanRowCard key={key} {...plan} />
                  ))
              : planes
                  .filter((plan: Plan) =>
                    plan.guests.includes(user.uid as string)
                  )
                  // .filter((plan: Plan) => new Date((plan.dateEnd?.seconds as number) * 1000) > new Date())
                  .filter((plan: Plan) => (parseDate(plan.dateEnd) as Date) > new Date())
                  .map((plan: Plan, key: number) => (
                    // <PlanCard key={key} {...plan} />
                    <PlanRowCard key={key} {...plan} />
                  ))}
          </ScrollView>
        )}
      </View>
    </View>
  );

  const onRefresh = () => {
    getData(); // Puedes optar por llamar a getData o cualquier otra función que actualice tus datos
  };

  const getData = async () => {
    setRefreshing(true);
    const collectionRef = collection(db, "Planes");

    await onSnapshot(collectionRef, async (data) => {
      setPlanes(
        await data.docs.map((item) => {
          const planData = { ...item.data(), id: item.id } as unknown;
          return planData as Plan;
        })
      );
      // console.log("Planes updated", JSON.stringify(planes, null, 2));
      setIsLoading(false);
      setRefreshing(false);
    });
  };

  const renderScene = SceneMap({
    myPlans: MyPlansRoute,
    joinedPlans: JoinedPlansRoute,
  });
  //hasta aqui

  const { uid } = useLocalSearchParams();

  const pickImage = async () => {
    //setRefreshing(true);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("🔴 ERROR: Permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // console.log(result.assets[0].uri);
        setImage(result.assets[0].uri);
        updateUser();
        //setIsLoadingUserData(true);
      }
    } catch (error) {
      console.log("🔴 ERROR: Error picking image", error);
    }
    setRefreshing(false);
  };

  const updateUser = async () => {
    setIsLoadingUserData(true);
    const { uid } = useUserStore.getState();
    const userId = uid;
    try {
      const uri = image as string;
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `users/${userId}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob as Blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + Math.round(progress) + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log("ERROR: Error uploading image", error);
          alert("Ha ocurrido un error al subir la imagen😔");
          setIsLoadingUserData(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              console.log("File available at", downloadURL);
              setImageUrl(downloadURL);
              const userRef = doc(db, `Usuarios/${userId}`);
              await updateDoc(userRef, {avatar: downloadURL as string });
            });
          }
        );
        setIsLoadingUserData(false);
    } catch (error) {
      console.log("🔴 ERROR: Error uploading image", error);
      alert("Ha ocurrido un error al subir la imagen😔");
      setIsLoadingUserData(false);
    }
  };

  const getUserData = async () => {
    const userId = useUserStore.getState().uid;
    setRefreshing(true);
    try {
      let userData: User = {} as User;
      const docRef = doc(db, "Usuarios", userId as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("User data:", docSnap.data());
        userData = docSnap.data() as User;
      }
      setUser(userData);
      setImage(userData.avatar as string);
      setIsLoadingUserData(false);
      setRefreshing(false);
      console.log(user);
    } catch (error) {
      console.log("🔴 ERROR: Error getting documents:", error);
    }
  };

  useEffect(() => {
    getUserData();
    getData();
  }, [uid, refreshData]);

  const avatarUri = useUserStore.getState().avatar;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {isLoadingUserData ? (
        <Text>Loading user data...</Text>
      ) : (
        <View>
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              <Image source={{uri: image as string}} style={styles.userPhoto}/>
              <View style={styles.iconContainer}>
                <Ionicons name="create-outline" size={24} color="black" />
              </View>
            </TouchableOpacity>
            <View style={{ gap: 10, alignItems: "center" }}>
              <Text style={styles.userName}>
                {user.firstName?.split(" ")[0]} {user.lastName?.split(" ")[0]}
              </Text>
              <Rating size={20} value={user.score as number} />
            </View>
          </View>

          <View style={styles.container2}>
            <Pressable
              style={styles.button}
              onPress={async () => await signOut(getAuth())}
            >
              <Text style={styles.textButton}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </View>
      )}

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={styles.indicator}
            style={styles.tabBar}
            labelStyle={styles.label2}
            activeColor="#FF9500" // Naranja para el texto de la pestaña activa
            inactiveColor="#F3A462" // Un tono más claro de naranja para las pestañas inactivas
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  scene: {
    flex: 4,
  },
  tabBar: {
    backgroundColor: "white", // Fondo blanco para un look minimalista
    shadowOpacity: 0, // Quitamos cualquier sombra para un diseño más limpio
    elevation: 0, // Eliminamos la elevación en Android
    borderBottomWidth: 1, // Añadimos un borde sutil en la parte inferior
    borderBottomColor: "#FF9500", // El color del borde es naranja para mantener tu tema
  },
  indicator: {
    backgroundColor: "#FF9500", // Color del indicador de la pestaña activa en naranja
    height: 3, // Hacemos el indicador un poco más grueso para que destaque
  },
  label: {
    fontWeight: "bold", // Texto en negrita para las etiquetas de las pestañas
    textTransform: "none", // Mantenemos el caso de texto original sin transformar
  },
  userInfo: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    //marginBottom: 10
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label2: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  info: {
    fontSize: 16,
  },
  container2: {
    marginTop: 20, // Ajustamos el margen superior para separarlo de otros elementos
    alignItems: "center", // Aseguramos que el botón esté centrado horizontalmente
    marginBottom: 20,
  },
  button: {
    backgroundColor: "transparent", // Fondo transparente para un look más sutil
    borderWidth: 2, // Grosor del borde
    borderColor: "#FF9500", // Color naranja para el borde, manteniendo el esquema de color
    borderRadius: 25, // Bordes redondeados
    height: 40, // Altura moderada
    width: 200, // Ancho fijo para controlar el tamaño del botón
    justifyContent: "center", // Alinea el texto verticalmente
    alignItems: "center", // Alinea el texto horizontalmente
    shadowOpacity: 0, // Eliminamos la sombra para mantener el aspecto minimalista
    elevation: 0, // Eliminamos la elevación en Android
  },
  textButton: {
    color: "#FF9500", // Utilizamos el mismo naranja para el texto, creando una cohesión visual
    fontWeight: "600", // Peso moderado del texto
    fontSize: 16, // Tamaño adecuado del texto para legibilidad
  },
  container2_index: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  plans_index: {
    display: "flex",
    gap: 10,
    height: "100%",
  },
  subTitle_index: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    transform: [{ translateX: -20 }, { translateY: -20 }], // Ajusta la posición del ícono
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Color de fondo del ícono
    padding: 38, // Relleno del ícono
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ProfilePage;
