import { StyleSheet, Text, View } from "react-native";

interface StepProps {
  steps: number;
  current: number;
}

const Step = ({ steps, current }: StepProps) => {
  return (
    <View>
      <View style={styles.container}>
        {[...Array(steps)].map((_, index) => (
          <View
            key={index}
            style={index < current ? styles.active : styles.inactive}
          />
        ))}
      </View>
      <Text style={styles.text}>
        Paso {current}/{steps}
      </Text>
    </View>
  );
};

export default Step;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: 24,
    gap: 4,
    alignItems: "center",
  },
  active: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#FF9500",
  },
  inactive: {
    flex: 1,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#ff95009e",
  },
  text: {
    marginLeft: 8,
    color: "#ff9500",
    fontSize: 14,
    width: "100%",
    textAlign: "center",
  },
});
