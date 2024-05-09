import { Plan } from "@/types/Plan.type";
import { timestampToDate } from "@/utils/Timestamp";
import { activities } from "@/utils/constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const PlanCard = (props: Plan) => {
  const { uid, name, picture, dateEnd, dateStart, description, labels } = props;

  // useEffect(() => {
  //   console.log("PlanCard props:", props);
  // }, []);

  return (
    <TouchableOpacity
      style={styles.userCardContainer}
      onPress={() => router.push(`/plan/${uid}`)}
    >
      {picture && (
        <Image
          contentFit="cover"
          source={{ uri: picture }}
          style={styles.userCardImage}
        />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.userCardTitle}>{name}</Text>
        <Text style={styles.userCardDate}>
          {/* {new Date((dateStart?.seconds as number) * 1000).toLocaleDateString()} */}
          {typeof dateStart !== undefined
            ? timestampToDate(dateStart as Timestamp)?.toLocaleDateString()
            : ""}
          {" - "}
          {/* {new Date((dateEnd?.seconds as number) * 1000).toLocaleDateString()} */}
          {typeof dateEnd !== undefined
            ? timestampToDate(dateEnd as Timestamp)?.toLocaleDateString()
            : ""}
        </Text>
        <Text style={styles.userCardDescription}>{description}</Text>
        {labels && (
          <View style={styles.labelsContainer}>
            {labels.map((label: string, index: number) => (
              <View key={index} style={styles.labelContainer}>
                <Text style={styles.labelText}>
                  {activities[label] || label}
                </Text>
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
    // shadow
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
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
    // resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  labelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
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
