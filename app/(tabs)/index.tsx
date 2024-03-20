import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "@/types/Plan.type";
import { useUserStore } from "@/store/user-store";
import { PlanCard } from "@/components/PlanCard";

const HomePage = () => {
  const insets = useSafeAreaInsets();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { firstName, gender } = useUserStore((state) => state);

  const getData = async () => {
    const collectionRef = collection(db, "Planes");

    await onSnapshot(collectionRef, async (data) => {
      setPlanes(
        await data.docs.map((item) => {
          const planData = { ...item.data(), id: item.id } as unknown;
          return planData as Plan;
        })
      );
      console.log("Planes updated", JSON.stringify(planes, null, 2));
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getData();
    console.log("re-render");
  }, []);

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Bienvenid{gender === "male" ? "o" : gender === "female" ? "a" : "x"}{" "}
          {firstName.split(" ")[0]} 👋
        </Text>
      </View>
      <View style={styles.container2}>
        <Text style={[{ marginBottom: 15 }, styles.subTitle]}>
          Planes cercanos
        </Text>
        {isLoading ? (
          <Text>Loading users...</Text>
        ) : (
          <ScrollView style={styles.plans}>
            {planes.map((plan: Plan, key: number) => (
              <PlanCard key={key} {...plan} />
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
  plans: {
    display: "flex",
    gap: 10,
  },
});

export default HomePage;
