import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import PlanStep from "@/layout/PlanStep";
import { useNewPlanStore } from "@/store/newPlan-store";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapboxPlacesAutocomplete from "react-native-mapbox-places-autocomplete";
import { GeoPoint } from "firebase/firestore";
import { useUserStore } from "@/store/user-store";

const step3 = () => {
  const setCurrentStep = useNewPlanStore((state) => state.setCurrent);
  const currentStep = useNewPlanStore((state) => state.current);

  const updateNewPlan = useNewPlanStore((state) => state.update);
  const setNewPlanAddress = useNewPlanStore((state) => state.setCurrentAddress);

  const setDireccionStore = useNewPlanStore((state) => state.setDireccion);

  const API_KEY = process.env.EXPO_PUBLIC_MAPBOX_API;

  // const [data, setData] = useState<any>({});

  useEffect(() => {
    setCurrentStep(3);
  }, []);

  const [userLocation, setUserLocation] = useState<any>(null);
  const [location, setLocation] = useState({
    latitude: 42.8006,
    longitude:  -1.6365,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
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
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleNext = () => {
    updateNewPlan({
      coordinates: new GeoPoint(marker.latitude, marker.longitude),
    });
    const newPlanName = useNewPlanStore.getState().name;
    const idUser = useUserStore.getState().uid;
    const data = useNewPlanStore.getState().currentAddress;

    setDireccionStore({
      alias: newPlanName,
      city: data?.context[2]?.text,
      coordinates: new GeoPoint(
        data?.geometry?.coordinates[1],
        data?.geometry?.coordinates[0]
      ),
      idUser,
      state: data?.context[3]?.text,
      street: data?.place_name?.split(",")[0],
      zipCode: parseInt(data?.context[1]?.text || "0"),
      uid: "",
    });
    console.log("Debug: HandleNext line 95");
    const coordinatesStore = useNewPlanStore.getState().coordinates;
    const direccionStore = useNewPlanStore.getState().direccion;
    console.log("Debug: HandleNext line 98");
    console.log("newPlan store: ", {
      coordinatesStore,
      direccionStore,
    });
  };

  return (
    <PlanStep
      current={currentStep}
      onPress={() => {
        console.log("====================================");
        console.log("Step 3");
        handleNext();
        console.log("====================================");
      }}
      isDisabled={marker.latitude === 0 && marker.longitude === 0}
    >
      <View>
        <Text style={[styles.title, { marginTop: 20 }]}>
          📍 Dónde se realizará
        </Text>
        {/* <View style={styles.searchContainer}> */}
        <MapboxPlacesAutocomplete
          placeholder="Buscar dirección"
          accessToken={API_KEY}
          onPlaceSelect={async (placeData: any) => {
            console.log(placeData);
            setMarker({
              latitude: placeData?.geometry?.coordinates[1],
              longitude: placeData?.geometry?.coordinates[0],
            });
            mapRef.current.animateToRegion({
              latitude: placeData?.geometry?.coordinates[1],
              longitude: placeData?.geometry?.coordinates[0],
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            setNewPlanAddress(placeData);
          }}
          onClearInput={() => {
            setMarker({
              latitude: 0,
              longitude: 0,
            });
            setNewPlanAddress({});
            mapRef.current.animateToRegion({
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }}
          countryId="es"
          id="origin"
          containerStyle={styles.containerStyle}
          inputStyle={styles.inputStyle}
        />
        {/* </View> */}
        <MapView
          // provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          ref={mapRef}
          // onLongPress={(e) => {
          //   console.log("LongPress coordinate", e.nativeEvent.coordinate);
          //   // create marker on long press
          //   setMarker(e.nativeEvent.coordinate);
          // }}
        >
          {marker.latitude !== 0 && marker.longitude !== 0 && (
            <Marker coordinate={marker} />
          )}
        </MapView>
      </View>
    </PlanStep>
  );
};

export default step3;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  map: {
    width: "100%",
    height: Dimensions.get("window").height - 350,
    borderRadius: 20,
    position: "relative",
    zIndex: 1,
  },
  containerStyle: {
    position: "absolute",
    zIndex: 999,
    width: "85%",
    height: 50,
    top: 100,
    left: 20,
    // backgroundColor: "red",
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 16, // Android
  },
  inputStyle: {
    // backgroundColor: "blue",
    backgroundColor: "transparent",
  },
});
