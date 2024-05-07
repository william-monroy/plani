import Step from "@/components/Step";
import { router } from "expo-router";
import {
  Dimensions,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/Button";
import DismissKeyboard from "@/components/DismissKeyboard";
import { useNewPlanStore } from "@/store/newPlan-store";
import { useEffect, useState } from "react";

interface PlanStepProps {
  current: number;
  style?: any;
  onPress?: () => void;
  isLoading?: boolean;
  isDisabled: boolean;
  children: React.ReactNode | React.ReactNode[];
}

const PlanStep = ({
  current,
  style,
  children,
  onPress,
  isDisabled,
  isLoading = false,
}: PlanStepProps) => {
  const insets = useSafeAreaInsets();
  const steps = useNewPlanStore((state) => state.steps);
  const setSteps = useNewPlanStore((state) => state.setSteps);
  const currentStep = useNewPlanStore((state) => state.current);
  const setCurrentStep = useNewPlanStore((state) => state.setCurrent);

  useEffect(() => {
    setSteps(4);
  }, []);

  return (
    <DismissKeyboard
      style={[
        { paddingTop: insets.top, paddingBottom: insets.bottom },
        styles.container,
      ]}
    >
      <TouchableOpacity
        style={styles.back}
        onPress={() => {
          if (currentStep === 1) {
            return router.push("/(tabs)");
          } else {
            setCurrentStep(current - 1);
            return router.push(`/(tabs)/(createPlan)/step${current - 1}`);
          }
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#FF9500" />
      </TouchableOpacity>
      <Step steps={steps} current={current} />
      <View style={[styles.content, style]}>
        <KeyboardAvoidingView behavior="position" style={styles.content}>
          {children}
        </KeyboardAvoidingView>
      </View>
      <View style={styles.contentBottom}>
        {current !== steps ? (
          <Button
            title="Continuar"
            onPress={() => {
              router.push(`/(tabs)/(createPlan)/step${current + 1}`);
              setCurrentStep(current + 1);
              onPress && onPress();
            }}
            disabled={isDisabled}
            loading={false}
            variant="filled"
            size="medium"
            fullWidth={false}
            rounded
          />
        ) : (
          <Button
            title="Crear Plan"
            onPress={() => {
              onPress && onPress();
            }}
            disabled={isDisabled}
            loading={isLoading}
            variant="filled"
            size="medium"
            fullWidth={false}
            rounded
          />
        )}
      </View>
    </DismissKeyboard>
  );
};

export default PlanStep;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    height: "100%",
    flex: 1,
  },
  content: {
    display: "flex",
    flex: 1,
    // backgroundColor: "red",
    width: "100%",
    height: Dimensions.get("window").height - 220,
    flexDirection: "column",
  },
  back: {
    padding: 5,
    marginBottom: 10,
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
  contentBottom: {
    height: 80,
    // backgroundColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
