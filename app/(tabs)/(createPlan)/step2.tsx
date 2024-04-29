import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import PlanStep from "@/layout/PlanStep";
import { useNewPlanStore } from "@/store/newPlan-store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { activities } from "@/utils/constants";

const step2 = () => {
  const setCurrentStep = useNewPlanStore((state) => state.setCurrent);
  const currentStep = useNewPlanStore((state) => state.current);
  const updateNewPlan = useNewPlanStore((state) => state.update);

  const [dateStart, setDateStart] = useState<Date>(new Date());
  const [dateEnd, setDateEnd] = useState<Date>(new Date());
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

  useEffect(() => {
    setCurrentStep(2);
  }, []);

  const handleNext = () => {
    updateNewPlan({
      dateStart: {
        seconds: dateStart.getTime() / 1000,
        nanoseconds: 0,
      },
      dateEnd: {
        seconds: dateEnd.getTime() / 1000,
        nanoseconds: 0,
      },
      labels: labels.filter((label) => label.value === true).map((l) => l.name),
    });
    const dateStartStore = useNewPlanStore.getState().dateStart;
    const dateEndStore = useNewPlanStore.getState().dateEnd;
    const labelsStore = useNewPlanStore.getState().labels;
    console.log("newPlan store: ", {
      dateStartStore,
      dateEndStore,
      labelsStore,
    });
  };

  return (
    <PlanStep
      current={currentStep}
      onPress={() => {
        console.log("====================================");
        console.log("Step 2");
        handleNext();
        console.log("====================================");
      }}
      isDisabled={
        !(
          cine ||
          fiesta ||
          deporte ||
          conciertos ||
          comida ||
          naturaleza ||
          teatro ||
          aventura ||
          eventoDepor ||
          copas ||
          fotografia ||
          moda ||
          baile ||
          relax ||
          cervezas ||
          juegos ||
          viajes ||
          cafe
        )
      }
    >
      <View>
        <Text style={[styles.title, { marginTop: 20 }]}>
          Unos detalles más 🪄
        </Text>
        {/* Fechas */}
        <Text style={styles.label}>Fechas para tu plan</Text>
        <Text>
          ¿Cuándo quieres que empiece tu plan? ¿Y cuándo quieres que termine?
        </Text>
        <View style={[styles.row, { marginTop: 10 }]}>
          <View style={(styles.rowItem, { alignItems: "flex-start" })}>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={dateStart}
                minimumDate={new Date()}
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
                    minimumDate={new Date()}
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
                minimumDate={dateStart}
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
                    minimumDate={dateStart}
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
        {/* Categorias */}
        <Text style={[styles.label, { marginTop: 20 }]}>Categorias</Text>
        <Text>
          ¿A qué categorías pertenece tu plan? Puedes seleccionar más de una.
        </Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.row}>
            <Pressable
              style={
                cine ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (cine ? setCine(false) : setCine(true))}
            >
              <Text style={styles.labelText}>{activities.cine}</Text>
            </Pressable>
            <Pressable
              style={
                fiesta ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (fiesta ? setFiesta(false) : setFiesta(true))}
            >
              <Text style={styles.labelText}>{activities.fiesta}</Text>
            </Pressable>
            <Pressable
              style={
                deporte ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (deporte ? setDeporte(false) : setDeporte(true))}
            >
              <Text style={styles.labelText}>{activities.deporte}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              style={
                conciertos
                  ? styles.labelContainerSelected
                  : styles.labelContainer
              }
              onPress={() =>
                conciertos ? setConciertos(false) : setConciertos(true)
              }
            >
              <Text style={styles.labelText}>{activities.conciertos}</Text>
            </Pressable>
            <Pressable
              style={
                comida ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (comida ? setComida(false) : setComida(true))}
            >
              <Text style={styles.labelText}>{activities.comida}</Text>
            </Pressable>
            <Pressable
              style={
                naturaleza
                  ? styles.labelContainerSelected
                  : styles.labelContainer
              }
              onPress={() =>
                naturaleza ? setNaturaleza(false) : setNaturaleza(true)
              }
            >
              <Text style={styles.labelText}>{activities.naturaleza}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              style={
                teatro ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (teatro ? setTeatro(false) : setTeatro(true))}
            >
              <Text style={styles.labelText}>{activities.teatro}</Text>
            </Pressable>
            <Pressable
              style={
                aventura ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() =>
                aventura ? setAventura(false) : setAventura(true)
              }
            >
              <Text style={styles.labelText}>{activities.aventura}</Text>
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
              <Text style={styles.labelText}>{activities.eventoDepor}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              style={
                copas ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (copas ? setCopas(false) : setCopas(true))}
            >
              <Text style={styles.labelText}>{activities.copas}</Text>
            </Pressable>
            <Pressable
              style={
                fotografia
                  ? styles.labelContainerSelected
                  : styles.labelContainer
              }
              onPress={() =>
                fotografia ? setFotografia(false) : setFotografia(true)
              }
            >
              <Text style={styles.labelText}>{activities.fotografia}</Text>
            </Pressable>
            <Pressable
              style={
                moda ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (moda ? setModa(false) : setModa(true))}
            >
              <Text style={styles.labelText}>{activities.moda}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              style={
                baile ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (baile ? setBaile(false) : setBaile(true))}
            >
              <Text style={styles.labelText}>{activities.baile}</Text>
            </Pressable>
            <Pressable
              style={
                relax ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (relax ? setRelax(false) : setRelax(true))}
            >
              <Text style={styles.labelText}>{activities.relax}</Text>
            </Pressable>
            <Pressable
              style={
                cervezas ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() =>
                cervezas ? setCervezas(false) : setCervezas(true)
              }
            >
              <Text style={styles.labelText}>{activities.cervezas}</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <Pressable
              style={
                viajes ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (viajes ? setViajes(false) : setViajes(true))}
            >
              <Text style={styles.labelText}>✈️ Viajes</Text>
            </Pressable>
            <Pressable
              style={
                juegos ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (juegos ? setJuegos(false) : setJuegos(true))}
            >
              <Text style={styles.labelText}>🎮 Juegos</Text>
            </Pressable>
            <Pressable
              style={
                cafe ? styles.labelContainerSelected : styles.labelContainer
              }
              onPress={() => (cafe ? setCafe(false) : setCafe(true))}
            >
              <Text style={styles.labelText}>☕️ Tomar un café</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </PlanStep>
  );
};

export default step2;

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
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  rowItem: {
    width: "50%",
  },
  userCardDate: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  input: {
    height: 50,
    borderRadius: 15,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#121212",
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
});
