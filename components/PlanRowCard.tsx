import { Plan } from "@/types/Plan.type";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const PlanRowCard = (props: Plan) => {
  const { uid, name, picture, dateEnd, dateStart, guests } = props;

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
        <View style={styles.row}>
          <Ionicons name="people" size={20} color="black" />
          {guests.length > 0 ? (
            <Text style={styles.asistentesText}>
              {" "}
              {guests.length} apuntados
            </Text>
          ) : (
            <Text style={styles.asistentesText}>
              {" "}
              Sé el primero en apuntarte
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  userCardContainer: {
    display: "flex",
    flexDirection: "row",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
  },
  userCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  userCardDate: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  userCardImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  asistentesText: {
    fontSize: 14,
    color: "#666",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
});
