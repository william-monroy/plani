import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../_infrastructure/firebase";

import { Plan } from "@/types/Plan.type";
import { PlanCard } from "@/components/PlanCard";

const UsersPage = () => {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const collectionRef = collection(db, "Planes");

    await onSnapshot(collectionRef, async (data) => {
      console.log("data", await data.docs);
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
            <PlanCard key={key} {...plan} />
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
});

export default UsersPage;
