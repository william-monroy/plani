import { Plan } from "@/types/Plan.type";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const PlanCard = (props: Plan) => {
  const {
    uid,
    name,
    picture,
    dateEnd,
    dateStart,
    description,
    guests,
    labels,
    score,
  } = props;

  useEffect(() => {
    console.log("PlanCard props:", props);
  }, []);

  return (
    <TouchableOpacity
      style={styles.userCardContainer}
      onPress={() => router.push(`/plan/${uid}`)}
    >
      {picture && (
        <Image source={{ uri: picture }} style={styles.userCardImage} />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.userCardTitle}>{name}</Text>
        <Text style={styles.userCardDate}>
          {new Date((dateStart?.seconds as number) * 1000).toLocaleDateString()}
          {" - "}
          {new Date((dateEnd?.seconds as number) * 1000).toLocaleDateString()}
        </Text>
        <Text style={styles.userCardDescription}>{description}</Text>
        {labels && (
          <View style={styles.labelsContainer}>
            {labels.map((label: string, index: number) => (
              <View key={index} style={styles.labelContainer}>
                <Text style={styles.labelText}>{label}</Text>
              </View>
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
    marginTop: 8,
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
    marginRight: 5,
    borderRadius: 5,
  },
  labelText: {
    fontSize: 12,
  },
});
