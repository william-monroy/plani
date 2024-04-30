import { StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import PlanStep from "@/layout/PlanStep";
import { useNewPlanStore } from "@/store/newPlan-store";

const step1 = () => {
  const setCurrentStep = useNewPlanStore((state) => state.setCurrent);
  const currentStep = useNewPlanStore((state) => state.current);

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // global newPlan store
  const updateNewPlan = useNewPlanStore((state) => state.update);
  const newPlan = useNewPlanStore();

  useEffect(() => {
    setCurrentStep(1);
  }, []);

  const handleNext = () => {
    updateNewPlan({ name, description });
    const nameStore = useNewPlanStore.getState().name;
    const descriptionStore = useNewPlanStore.getState().description;
    console.log("newPlan store: ", {
      nameStore,
      descriptionStore,
    });
  };

  return (
    <PlanStep
      current={currentStep}
      style={styles.container}
      onPress={() => {
        console.log("====================================");
        console.log("Step 1");
        handleNext();
        console.log("====================================");
      }}
      isDisabled={name === "" || description === ""}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { marginTop: 20 }]}>
          Cuéntanos sobre tu Plan
        </Text>
        <Text style={styles.label}>Nombre del Plan</Text>
        <TextInput
          style={styles.inputText}
          placeholder="Ingresa el nombre para tu plan"
          id="nombre"
          onChangeText={setName}
        />
        <Text style={styles.label}>Descripción del Plan</Text>
        <TextInput
          style={[styles.inputText, { height: 180, textAlignVertical: "top" }]}
          placeholder="Ingresa el nombre para tu plan"
          multiline={true}
          numberOfLines={4}
          onChangeText={setDescription}
          id="descripcion"
        />
      </View>
    </PlanStep>
  );
};

export default step1;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
  },
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
  inputText: {
    backgroundColor: "#e6e6e6",
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
  },
});
