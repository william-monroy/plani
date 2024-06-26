import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../_infrastructure/firebase";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  Switch,
  TouchableOpacity,
} from "react-native";
import { User } from "@/types/User.type";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Plan } from "@/types/Plan.type";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Rating from "@/components/UserRating";
import { PlanRowCard } from "@/components/PlanRowCard";
import LoadingView from "@/layout/LoadingView";
import { Ionicons } from "@expo/vector-icons";
import { parseDate } from "@/utils/Timestamp";

const UserPage = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User>({} as User);
  const [refreshData, setRefreshData] = useState(false); // Añade este estado
  const [image, setImage] = useState<string>(""); // Añade este estado
  const [index, setIndex] = useState(0);
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isEnabledMyPlans, setIsEnabledMyPlans] = useState(true);
  const toggleSwitchMyPlans = () =>
    setIsEnabledMyPlans((previousState) => !previousState);
  const [isEnabledJoined, setIsEnabledJoined] = useState(true);
  const toggleSwitchJoined = () =>
    setIsEnabledJoined((previousState) => !previousState);

  const [routes] = useState([
    { key: "myPlans", title: "Sus Planes" },
    { key: "joinedPlans", title: "Apuntado" },
  ]);

  const initialLayout = { width: Dimensions.get("window").width };

  const handleRefresh = () => {
    setRefreshData(true); // Cambia el estado para forzar recarga
    getData().then(() => {
      setRefreshData(false); // Restablece el estado de refresco
    });
  };

  const MyPlansRoute = () => (
    <View style={[styles.scene, { backgroundColor: "#ffffff" }]}>
      <View style={styles.container2_index}>
        {isLoading ? (
          <LoadingView text="Cargando Planes..." />
        ) : (
          <View style={styles.plans_index}>
            <ScrollView
              style={styles.plans_index}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={handleRefresh}
                />
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
              {isEnabledMyPlans
                ? planes
                    .filter(
                      (plan: Plan) => plan.idAdmin == (user.uid as string)
                    )
                    .map((plan: Plan, key: number) => (
                      // <PlanCard key={key} {...plan} />
                      <PlanRowCard key={key} {...plan} />
                    ))
                : planes
                    .filter(
                      (plan: Plan) => plan.idAdmin == (user.uid as string)
                    )
                    // .filter((plan: Plan) => new Date((plan.dateEnd?.seconds as number) * 1000) > new Date())
                    .filter((plan: Plan) => (parseDate(plan.dateEnd) as Date) > new Date())
                    .map((plan: Plan, key: number) => (
                      // <PlanCard key={key} {...plan} />
                      <PlanRowCard key={key} {...plan} />
                    ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );

  const JoinedPlansRoute = () => (
    <View style={[styles.scene, { backgroundColor: "#ffffff" }]}>
      <View style={styles.container2_index}>
        {isLoading ? (
          <LoadingView text="Cargando Planes..." />
        ) : (
          <ScrollView
            style={styles.plans_index}
            refreshControl={
              <RefreshControl
                refreshing={refreshData}
                onRefresh={handleRefresh}
              />
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
            {isEnabledJoined
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

  const getData = async () => {
    const collectionRef = collection(db, "Planes");

    await onSnapshot(collectionRef, async (data) => {
      setPlanes(
        await data.docs.map((item) => {
          const planData = { ...item.data(), id: item.id } as unknown;
          return planData as Plan;
        })
      );
      console.log("Planes updated", JSON.stringify(planes, null, 2));
      setIsLoading(false);
    });
  };

  const renderScene = SceneMap({
    myPlans: MyPlansRoute,
    joinedPlans: JoinedPlansRoute,
  });

  const getUserData = async () => {
    try {
      const q = query(collection(db, "Usuarios"), where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map((doc) => doc.data() as User);
      if (user.length > 0) {
        const userData = user[0];
        setUser(userData);
        setImage(userData.avatar as string);
      }
      setIsLoadingUserData(false);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    getUserData();
    getData();
  }, [id, refreshData]);

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      {isLoadingUserData ? (
        // <Text>Cargando datos del usuario...</Text>
        <LoadingView text="" />
      ) : (
        <View>
          <TouchableOpacity style={styles.row} onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              style={styles.icon}
              color="#FF9500"
            />
            <Text style={{ fontSize: 14, color: "#FF9500" }}>Regresar</Text>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image source={{ uri: image as string }} style={styles.userPhoto} />
            <View style={{ gap: 10, alignItems: "center" }}>
              <Text style={styles.userName}>
                {user.firstName.split(" ")[0]} {user.lastName.split(" ")[0]}
              </Text>
              <Rating size={20} value={user.score as number} />
            </View>
          </View>
        </View>
      )}
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          myPlans: MyPlansRoute,
          joinedPlans: JoinedPlansRoute,
        })}
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
    padding: 20,
    backgroundColor: "#fff",
  },
  scene: {
    flex: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 110,
  },
  icon: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    // marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 10
  },
  userPhoto: {
    width: 90,
    height: 90,
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
    // marginTop: 10,
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
});

export default UserPage;
