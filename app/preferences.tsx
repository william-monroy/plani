import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import {
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import { Octicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";
import { useUserStore } from "@/store/user-store";

const PreferencesScreen = () => {
  const [cine, setCine] = useState(false);
  const [fiesta, setFiesta] = useState(false);
  const [deporte, setDeporte] = useState(false);
  const [conciertos, setConciertos] = useState(false);
  const [comida, setComida] = useState(false);
  const [naturaleza, setNaturaleza] = useState(false);
  const [teatro, setTeatro] = useState(false);
  const [aventura, setAventura] = useState(false);
  const [eventoDepor, setEventoDepor] = useState(false);
  const [copas, setCopas] = useState(false);
  const [fotografia, setFotografia] = useState(false);
  const [moda, setModa] = useState(false);
  const [baile, setBaile] = useState(false);
  const [relax, setRelax] = useState(false);
  const [cervezas, setCervezas] = useState(false);
  const [juegos, setJuegos] = useState(false);
  const [viajes, setViajes] = useState(false);
  const [cafe, setCafe] = useState(false);
  const preferences = [
    { name: "cine", value: cine },
    { name: "fiesta", value: fiesta },
    { name: "deporte", value: deporte },
    { name: "conciertos", value: conciertos },
    { name: "comida", value: comida },
    { name: "naturaleza", value: naturaleza },
    { name: "teatro", value: teatro },
    { name: "aventura", value: aventura },
    { name: "eventoDepor", value: eventoDepor },
    { name: "copas", value: copas },
    { name: "fotografia", value: fotografia },
    { name: "moda", value: moda },
    { name: "baile", value: baile },
    { name: "relax", value: relax },
    { name: "cervezas", value: cervezas },
    { name: "juegos", value: juegos },
    { name: "viajes", value: viajes },
    { name: "cafe", value: cafe },
  ];

  const handlePreferences = async () => {
    const { uid } = useUserStore.getState();
    const userId = uid;
    try {
      const selectedPreferences = preferences
        .filter((pref) => pref.value === true)
        .map((pref) => pref.name);

      const q = query(collection(db, "Usuarios"), where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docRef) => {
        const userDoc = doc(db, "Usuarios", docRef.id);
        await updateDoc(userDoc, {
          labels: selectedPreferences,
        });
        // console.log("Document updated for user with ID: ", userId);
        router.replace("/(tabs)");
      });
    } catch (e) {
      console.log("🔴 ERROR: Error adding document", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué planes te gustan?</Text>
      <Text style={styles.text}>
        Selecciona tus planes favoritos, y así te recomendaremos los que mejor
        se adapten a ti😁
      </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (cine ? setCine(false) : setCine(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/cine.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Cine</Text>
            <Octicons
              name={cine ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (fiesta ? setFiesta(false) : setFiesta(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/fiesta.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Fiesta</Text>
            <Octicons
              name={fiesta ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (deporte ? setDeporte(false) : setDeporte(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/deporte.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Deporte</Text>
            <Octicons
              name={deporte ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() =>
              conciertos ? setConciertos(false) : setConciertos(true)
            }
          >
            <ImageBackground
              source={require("../assets/preferences/concierto.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Conciertos</Text>
            <Octicons
              name={conciertos ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (comida ? setComida(false) : setComida(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/comida.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Gastronomía</Text>
            <Octicons
              name={comida ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() =>
              naturaleza ? setNaturaleza(false) : setNaturaleza(true)
            }
          >
            <ImageBackground
              source={require("../assets/preferences/naturaleza.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Naturaleza</Text>
            <Octicons
              name={naturaleza ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (teatro ? setTeatro(false) : setTeatro(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/teatro.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Teatro</Text>
            <Octicons
              name={teatro ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (aventura ? setAventura(false) : setAventura(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/aventura.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Aventura</Text>
            <Octicons
              name={aventura ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() =>
              eventoDepor ? setEventoDepor(false) : setEventoDepor(true)
            }
          >
            <ImageBackground
              source={require("../assets/preferences/evento_deportivo.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Evento deportivo</Text>
            <Octicons
              name={eventoDepor ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (copas ? setCopas(false) : setCopas(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/copas.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Ir de copas</Text>
            <Octicons
              name={copas ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() =>
              fotografia ? setFotografia(false) : setFotografia(true)
            }
          >
            <ImageBackground
              source={require("../assets/preferences/fotografia.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Fotografía</Text>
            <Octicons
              name={fotografia ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (moda ? setModa(false) : setModa(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/moda.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Moda</Text>
            <Octicons
              name={moda ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (baile ? setBaile(false) : setBaile(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/baile.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Baile</Text>
            <Octicons
              name={baile ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (relax ? setRelax(false) : setRelax(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/relax.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Relax</Text>
            <Octicons
              name={relax ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (cervezas ? setCervezas(false) : setCervezas(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/cervezas.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Tomar algo</Text>
            <Octicons
              name={cervezas ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (viajes ? setViajes(false) : setViajes(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/viajes.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Viajes</Text>
            <Octicons
              name={viajes ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={styles.planButton}
            onPress={() => (juegos ? setJuegos(false) : setJuegos(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/juegos.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Juegos</Text>
            <Octicons
              name={juegos ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
          <Pressable
            style={styles.planButton}
            onPress={() => (cafe ? setCafe(false) : setCafe(true))}
          >
            <ImageBackground
              source={require("../assets/preferences/cafe.jpg")}
              style={styles.backgroundImage}
            />
            <Text style={styles.textButton}>Tomar un café</Text>
            <Octicons
              name={cafe ? "check" : "plus"}
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
      </ScrollView>
      <Pressable style={styles.button} onPress={handlePreferences}>
        <Text style={styles.textButton}>Aceptar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: "30%",
    marginBottom: 20,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    marginTop: "30%",
    marginBottom: 20,
    width: "75%",
    height: 40,
    backgroundColor: "orange",
    borderRadius: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    position: "absolute",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  backgroundImage: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    opacity: 0.7,
    justifyContent: "center",
  },
  planButton: {
    width: "45%",
    height: 100,
    backgroundColor: "orange",
    borderRadius: 10,
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  icon: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
});

export default PreferencesScreen;
