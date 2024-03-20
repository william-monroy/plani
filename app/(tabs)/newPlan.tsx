import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { addDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { useUserStore } from "@/store/user-store";

const UsersPage = () => {
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());
  const [name, setName] = useState<string>("Añade un título...");
  const [description, setDescription] = useState<string>(
    "Añade una descripción..."
  );
  const [showDatePickerStart, setShowDatePickerStart] = useState(false);
  const [showDatePickerEnd, setShowDatePickerEnd] = useState(false);

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
  const labels = [
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

  useEffect(() => {
    setShowDatePickerStart(false);
    setShowDatePickerEnd(false);
  }, []);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const addPlan = async () => {
    const { uid } = useUserStore.getState();
    const userId = uid;
    try {
      const selectedLabels = labels
        .filter((label) => label.value === true)
        .map((label) => label.name);
      const docRef = await addDoc(collection(db, "Planes"), {
        // TODO: FALTA AÑADIR DIRECCION, COORDENADAS Y CREAR LA VALORACION IMAGINO
        coordinates: [],
        dateEnd: dateEnd,
        dateStart: dateStart,
        description: description,
        guests: [],
        idAdmin: userId,
        idDireccion: "",
        idValoracion: "",
        labels: selectedLabels,
        name: name,
        picture: image,
        request: [],
        score: 0,
      })
        .then((docRef) => {
          updateDoc(docRef, { uid: docRef.id });
        })
        .catch((error) => {
          console.error("Error adding plan: ", error);
        });
      // console.log("Plan added from user: ", userId);
      resetValues(); // NO LOS RESETEA
      alert("Plan añadido!🥳");
    } catch (error) {
      console.error("Error adding plan: ", error);
    }
  };

  const resetValues = () => {
    setImage(null);
    setDateStart(new Date());
    setDateEnd(new Date());
    setName("Añade un título...");
    setDescription("Añade una descripción...");
    setShowDatePickerStart(false);
    setShowDatePickerEnd(false);
    setCine(false);
    setFiesta(false);
    setDeporte(false);
    setConciertos(false);
    setComida(false);
    setNaturaleza(false);
    setTeatro(false);
    setAventura(false);
    setEventoDepor(false);
    setCopas(false);
    setFotografia(false);
    setModa(false);
    setBaile(false);
    setRelax(false);
    setCervezas(false);
    setJuegos(false);
    setViajes(false);
    setCafe(false);
  };

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Añade un nuevo plan!</Text>
      </View>
      <TouchableOpacity style={styles.userCardContainer} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.userCardImage} />
        ) : (
          <Image
            source={require("../../assets/plan.jpg")}
            style={styles.userCardImage}
          />
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.userCardTitle}
        placeholder="Nombre del plan..."
        onChangeText={setName}
      />
      <View style={styles.row}>
        <View style={(styles.rowItem, { alignItems: "flex-start" })}>
          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={dateStart}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDateStart(selectedDate);
                  setShowDatePickerStart(false);
                }
              }}
            />
          ) : (
            <Pressable
              style={[
                styles.input,
                {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => setShowDatePickerStart(true)}
            >
              <Text>{dateStart.toDateString()}</Text>
              {showDatePickerStart && (
                <DateTimePicker
                  value={dateStart}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setDateStart(selectedDate);
                      setShowDatePickerStart(false);
                    }
                  }}
                />
              )}
            </Pressable>
          )}
        </View>
        <Text style={styles.userCardDate}>-</Text>
        <View style={(styles.rowItem, { alignItems: "flex-start" })}>
          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={dateStart}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDateEnd(selectedDate);
                  setShowDatePickerEnd(false);
                }
              }}
            />
          ) : (
            <Pressable
              style={[
                styles.input,
                {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              onPress={() => setShowDatePickerEnd(true)}
            >
              <Text>{dateEnd.toDateString()}</Text>
              {showDatePickerEnd && (
                <DateTimePicker
                  value={dateEnd}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setDateEnd(selectedDate);
                      setShowDatePickerEnd(false);
                    }
                  }}
                />
              )}
            </Pressable>
          )}
        </View>
      </View>
      <View>
        <TextInput
          style={styles.userCardDescription}
          placeholder="Añade una descripción..."
          onChangeText={setDescription}
          multiline={true}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Pressable
            style={cine ? styles.labelContainerSelected : styles.labelContainer}
            onPress={() => (cine ? setCine(false) : setCine(true))}
          >
            <Text style={styles.labelText}>Cine</Text>
          </Pressable>
          <Pressable
            style={
              fiesta ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (fiesta ? setFiesta(false) : setFiesta(true))}
          >
            <Text style={styles.labelText}>Fiesta</Text>
          </Pressable>
          <Pressable
            style={
              deporte ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (deporte ? setDeporte(false) : setDeporte(true))}
          >
            <Text style={styles.labelText}>Deporte</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={
              conciertos ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() =>
              conciertos ? setConciertos(false) : setConciertos(true)
            }
          >
            <Text style={styles.labelText}>Conciertos</Text>
          </Pressable>
          <Pressable
            style={
              comida ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (comida ? setComida(false) : setComida(true))}
          >
            <Text style={styles.labelText}>Gastronomía</Text>
          </Pressable>
          <Pressable
            style={
              naturaleza ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() =>
              naturaleza ? setNaturaleza(false) : setNaturaleza(true)
            }
          >
            <Text style={styles.labelText}>Naturaleza</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={
              teatro ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (teatro ? setTeatro(false) : setTeatro(true))}
          >
            <Text style={styles.labelText}>Teatro</Text>
          </Pressable>
          <Pressable
            style={
              aventura ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (aventura ? setAventura(false) : setAventura(true))}
          >
            <Text style={styles.labelText}>Aventura</Text>
          </Pressable>
          <Pressable
            style={
              eventoDepor
                ? styles.labelContainerSelected
                : styles.labelContainer
            }
            onPress={() =>
              eventoDepor ? setEventoDepor(false) : setEventoDepor(true)
            }
          >
            <Text style={styles.labelText}>Evento deportivo</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={
              copas ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (copas ? setCopas(false) : setCopas(true))}
          >
            <Text style={styles.labelText}>Ir de copas</Text>
          </Pressable>
          <Pressable
            style={
              fotografia ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() =>
              fotografia ? setFotografia(false) : setFotografia(true)
            }
          >
            <Text style={styles.labelText}>Fotografía</Text>
          </Pressable>
          <Pressable
            style={moda ? styles.labelContainerSelected : styles.labelContainer}
            onPress={() => (moda ? setModa(false) : setModa(true))}
          >
            <Text style={styles.labelText}>Moda</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={
              baile ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (baile ? setBaile(false) : setBaile(true))}
          >
            <Text style={styles.labelText}>Baile</Text>
          </Pressable>
          <Pressable
            style={
              relax ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (relax ? setRelax(false) : setRelax(true))}
          >
            <Text style={styles.labelText}>Relax</Text>
          </Pressable>
          <Pressable
            style={
              cervezas ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (cervezas ? setCervezas(false) : setCervezas(true))}
          >
            <Text style={styles.labelText}>Tomar algo</Text>
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable
            style={
              viajes ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (viajes ? setViajes(false) : setViajes(true))}
          >
            <Text style={styles.labelText}>Viajes</Text>
          </Pressable>
          <Pressable
            style={
              juegos ? styles.labelContainerSelected : styles.labelContainer
            }
            onPress={() => (juegos ? setJuegos(false) : setJuegos(true))}
          >
            <Text style={styles.labelText}>Juegos</Text>
          </Pressable>
          <Pressable
            style={cafe ? styles.labelContainerSelected : styles.labelContainer}
            onPress={() => (cafe ? setCafe(false) : setCafe(true))}
          >
            <Text style={styles.labelText}>Tomar un café</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={styles.container2}>
        <Pressable style={styles.button} onPress={addPlan}>
          <Text style={styles.textButton}>Añadir</Text>
        </Pressable>
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
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
    flex: 1, // Usa flex para que el contenedor se expanda
    justifyContent: "center", // Centra los elementos hijos verticalmente
    alignItems: "center", // Centra los elementos hijos horizontalmente
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#121212",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  rowItem: {
    width: "50%",
  },
  plans: {
    display: "flex",
    gap: 10,
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
  input: {
    height: 50,
    borderRadius: 15,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#121212",
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Aseguramos que el texto sea blanco para mejor contraste
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderWidth: 2, // Añade un borde con un grosor de 2
    borderColor: "#ddd", // El color del borde
    borderRadius: 10, // Bordes redondeados con un radio de 10
    shadowColor: "#000", // Color de la sombra
    shadowOffset: {
      // Offset de la sombra
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de difusión de la sombra
    elevation: 5, // Elevación para Android que también añade una sombra
  },

  userCardContainer: {
    display: "flex",
    flexDirection: "column",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
    paddingBottom: 10,
  },
  userCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  userCardSubTitle: {
    fontSize: 18,
  },
  userCardDate: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  userCardDescription: {
    fontSize: 14,
    marginTop: 5,
    color: "#666",
  },
  userCardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  labelsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  labelContainer: {
    backgroundColor: "#e0e0e0",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  labelContainerSelected: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  labelText: {
    fontSize: 12,
  },
  icon: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
});

export default UsersPage;
