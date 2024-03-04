import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import { Timestamp, collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "../_entities/Plan.type";
import { PlanCardProps } from "./_entities/PlanCardProps";

const PlanCard = ({ plan }: PlanCardProps) => {
  const {
    name,
    picture,
    dateEnd,
    dateStart,
    description,
    guests,
    labels,
    score,
  } = plan;

  return (
    <TouchableOpacity style={styles.userCardContainer}>
      {picture && (
        <Image source={{ uri: picture }} style={styles.userCardImage} />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.userCardTitle}>{name}</Text>
        {labels && (
          <View style={styles.labelsContainer}>
            {labels.map((label, index) => (
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

const UsersPage = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const collectionRef = collection(db, "Planes");

    await onSnapshot(collectionRef, async (data) => {
      setPlanes(
        await data.docs.map((item) => {
          const planData = { ...item.data(), id: item.id } as unknown;
          return planData as Plan;
        })
      );
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 15 }}>All</Text>
      {isLoading ? (
        <Text>Loading users...</Text>
      ) : (
        <ScrollView>
          {planes.map((plan: Plan, key: number) => (
            <PlanCard key={key} plan={plan} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  userCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    // backgroundColor: "cyan",
  },
  userCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 7,
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
    marginTop: 5,
  },
  labelText: {
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginRight: 5,
    borderRadius: 5,
  },
});

export default UsersPage;
