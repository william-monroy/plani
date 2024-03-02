import { Fragment, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "../_entities/Plan";
import { PlanCardProps } from "./_entities/PlanCardProps";

const PlanCard = ({ plan }: PlanCardProps) => {
  const { name, picture, dateEnd, dateStart, description, guests, labels, score } = plan;

  return (
    <TouchableOpacity style={styles.userCardContainer}>
      {picture && <Image source={{ uri: picture }} style={styles.userCardImage} />}
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

const HomePage = () => {
  const insets = useSafeAreaInsets();
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
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>Bienvenido 👋</Text>
      </View>
      <View style={styles.container2}>
        <Text style={[{ marginBottom: 15}, styles.subTitle]}>Planes cercanos</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 20,
    width: "100%",
    height: "100%",
    backgroundColor: "#f9f9f9",
  },
  header: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container2: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
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

export default HomePage;
