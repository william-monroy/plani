import { Plan } from "@/types/Plan.type";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const PlanCard = ({
  name,
  picture,
  dateEnd,
  dateStart,
  description,
  guests,
  labels,
  score,
}: Plan) => {
  return (
    <TouchableOpacity style={styles.userCardContainer}>
      {picture && (
        <Image source={{ uri: picture }} style={styles.userCardImage} />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.userCardTitle}>{name}</Text>
        {labels && (
          <View style={styles.labelsContainer}>
            {labels.map((label: string, index: number) => (
              <Text key={index} style={styles.labelText}>
                {label}
              </Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  userCardSubTitle: {
    fontSize: 14,
    color: "gray",
  },
  userCardImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginTop: 10,
  },
  labelsContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  labelText: {
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
    fontSize: 12,
  },
});
