import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "@/types/Plan.type";
import { useUserStore } from "@/store/user-store";
import { PlanCard } from "@/components/PlanCard";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HomePage = () => {
  const insets = useSafeAreaInsets();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [view, setView] = useState<"list" | "map">("map");

  const { firstName, gender } = useUserStore((state) => state);
  const uid = useUserStore.getState().uid;
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
      console.log("Planes updated", JSON.stringify(planes, null, 2));
      setIsLoading(false);
      setRefreshing(false);
    });
  };

  const onRefresh = () => {
    getData(); // Puedes optar por llamar a getData o cualquier otra función que actualice tus datos
  };

  useEffect(() => {
    getData();
    console.log("re-render");
  }, []);

  const [userLocation, setUserLocation] = useState<any>(null);
  const [location, setLocation] = useState({
    latitude: 42.8006,
    longitude: -1.6365,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef<any>();

  useEffect(() => {
    (async () => {
      // permissions check
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // do something when permission is denied
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      console.log(location);
      setUserLocation(location);
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    })();
  }, []);

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Bienvenid{gender === "male" ? "o" : gender === "female" ? "a" : "x"}{" "}
          {firstName.split(" ")[0]} 👋
        </Text>
        <TouchableOpacity onPress={() => router.push(`/notificaciones/${uid}`)}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container2}>
        <View style={[styles.row, { marginBottom: 15 }]}>
          <Text style={styles.subTitle}>Planes cercanos</Text>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <Ionicons
              name={view === "list" ? "map-outline" : "map"}
              size={24}
              color={view === "list" ? "gray" : "#FF9500"}
              onPress={() => {
                if (view === "list") {
                  setView("map");
                } else {
                  setView("list");
                }
              }}
            />
            <Ionicons
              name={view === "list" ? "list" : "list-outline"}
              size={24}
              color={view === "list" ? "#FF9500" : "gray"}
              onPress={() => {
                if (view === "list") {
                  setView("map");
                } else {
                  setView("list");
                }
              }}
            />
          </View>
        </View>
        {isLoading ? (
          <Text>Loading plans...</Text>
        ) : view === "list" ? (
          <ScrollView
            style={styles.plans}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {planes.map((plan: Plan, key: number) => (
              <PlanCard key={key} {...plan} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.mapView}>
            <MapView
              style={styles.map}
              initialRegion={location}
              showsMyLocationButton
              showsUserLocation
              ref={mapRef}
              // provider={PROVIDER_GOOGLE}
            >
              {planes.map(
                (plan: Plan, key: number) =>
                  plan.coordinates.latitude && (
                    <Marker
                      key={key}
                      coordinate={{
                        latitude: plan?.coordinates?.latitude,
                        longitude: plan?.coordinates?.longitude,
                      }}
                      onCalloutPress={() => {
                        router.push(`/(tabs)/plan/${plan.uid}`);
                      }}
                      title={plan.name}
                      description={plan.description}
                    />
                  )
              )}
            </MapView>
          </View>
        )}
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
    height: "90%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapView: {
    display: "flex",
    height:
      Dimensions.get("window").height - (Platform.OS === "ios" ? 280 : 220),
    width: "100%",
    position: "relative",
    zIndex: 1,
  },
  map: {
    borderRadius: 20,
    width: "100%",
    height: "100%",
  },
});

export default HomePage;
