import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";
import { Plan } from "@/types/Plan.type";
import { useEffect, useState } from "react";

export default function PlanScreen() {
  const insets = useSafeAreaInsets();

  const [planData, setPlanData] = useState<Plan>({} as Plan);
  const [liked, setLiked] = useState<boolean>(false);

  const { uid } = useLocalSearchParams();

  const getPlanData = async () => {
    const q = query(collection(db, "Planes"), where("uid", "==", uid));
    await getDocs(q).then((response) => {
      response.docs.map(async (data) => {
        console.log(await data.data());
        setPlanData({} as Plan);
        setPlanData({ ...(data.data() as Plan) });
      });
    });
  };

  useEffect(() => {
    setPlanData({} as Plan);
    getPlanData();
  }, [uid]);

  return (
    <View style={[{ paddingTop: insets.top }, styles.container]}>
      <Image source={{ uri: planData?.picture }} style={styles.planImage} />
      <View style={styles.navContainer}>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <BlurView intensity={100} style={styles.blurContainer}>
            <Ionicons name="arrow-back" size={24} color="#fffdfd" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <BlurView intensity={60} style={styles.blurContainer} tint="dark">
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#EF4F5D" : "#fffdfd"}
            />
          </BlurView>
        </TouchableOpacity>
      </View>
      <View style={styles.spacer} />
      <View style={styles.contentCard}>
        <Text style={styles.titleCard}>Plan {uid}</Text>
        <View style={styles.row}>
          <Text style={styles.score}>0</Text>
          <Ionicons name="star" size={24} color="#ffce04" />
        </View>
        <Link href="/" style={{ color: "blue" }}>
          Home
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  navContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  blurContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 15,
    flexDirection: "row",
  },
  planImage: {
    width: "100%",
    height: 350,
    position: "absolute",
    top: 0,
    zIndex: -1,
  },
  spacer: {
    height: 200,
  },
  contentCard: {
    backgroundColor: "#fafafa",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    flex: 1,
  },
  titleCard: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 16,
    marginRight: 10,
  },
});
