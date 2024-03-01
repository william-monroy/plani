import React, {useState} from 'react'
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import { ScrollView, Text, Pressable, StyleSheet, View } from 'react-native'
import { Octicons } from "@expo/vector-icons";

const PreferencesScreen = () => {
  const [cine, setCine] = useState(false);
  const [fiesta, setFiesta] = useState(false);
  const [deporte, setDeporte] = useState(false);
  const [conciertos, setConciertos] = useState(false);
  const [comida, setComida] = useState(false);
  const [naturaleza, setNaturaleza] = useState(false);
  const [teatro, setTeatro] = useState(false);
  const [aventura, setAventura] = useState(false);

  const handlePreferences = async () => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        router.replace("/(tabs)");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué planes te gustan?</Text>
      <Text style={styles.text}>Selecciona tus planes favoritos, y así te recomendaremos los que mejor se adapten a ti😁</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.row}>
          <Pressable style={styles.planButton}
            onPress={() => cine ? setCine(false) : setCine(true)}>
            <Text style={styles.textButton}>Cine</Text>
            <Octicons name={cine ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
          <Pressable style={styles.planButton}
            onPress={() => fiesta ? setFiesta(false) : setFiesta(true)}>
            <Text style={styles.textButton}>Fiesta</Text>
            <Octicons name={fiesta ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable style={styles.planButton}
            onPress={() => deporte ? setDeporte(false) : setDeporte(true)}>
            <Text style={styles.textButton}>Deporte</Text>
            <Octicons name={deporte ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
          <Pressable style={styles.planButton}
            onPress={() => conciertos ? setConciertos(false) : setConciertos(true)}>
            <Text style={styles.textButton}>Conciertos</Text>
            <Octicons name={conciertos ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable style={styles.planButton}
            onPress={() => comida ? setComida(false) : setComida(true)}>
            <Text style={styles.textButton}>Gastronomía</Text>
            <Octicons name={comida ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
          <Pressable style={styles.planButton}
            onPress={() => naturaleza ? setNaturaleza(false) : setNaturaleza(true)}>
            <Text style={styles.textButton}>Naturaleza</Text>
            <Octicons name={naturaleza ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.row}>
          <Pressable style={styles.planButton}
            onPress={() => teatro ? setTeatro(false) : setTeatro(true)}>
            <Text style={styles.textButton}>Teatro</Text>
            <Octicons name={teatro ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
          <Pressable style={styles.planButton}
            onPress={() => aventura ? setAventura(false) : setAventura(true)}>
            <Text style={styles.textButton}>Aventura</Text>
            <Octicons name={aventura ? 'check' : 'plus'} size={24} color="black" style={styles.icon} />
          </Pressable>
        </View>
      </ScrollView>
      <Pressable style={styles.button} onPress={handlePreferences}>
        <Text style={styles.textButton}>Aceptar</Text>
      </Pressable>
    </View>
  )
}

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
    marginTop: '30%',
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
    marginTop: '30%',
    marginBottom: 20,
    width: '75%',
    height: 40,
    backgroundColor: "orange",
    borderRadius: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 19,
    fontWeight: "700",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  planButton: {
    width: '45%',
    height: 100,
    backgroundColor: "orange",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  icon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
});

export default PreferencesScreen