import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";
import { Plan } from "@/types/Plan.type";
import { useEffect, useState } from "react";
import Rating from "@/components/Rating";
import { User } from "@/types/User.type";

export default function PlanScreen() {
  const insets = useSafeAreaInsets();

  const [planData, setPlanData] = useState<Plan>({} as Plan);
  const [liked, setLiked] = useState<boolean>(false);
  const [guests, setGuests] = useState<User[]>([] as User[]);

  const { uid } = useLocalSearchParams();

  const getPlanData = async () => {
    const q = query(collection(db, "Planes"), where("uid", "==", uid));
    const querySnapshot: any = await getDocs(q)
      .then(async (response) => {
        response.docs.map(async (data) => {
          console.log(await data.data());
          setPlanData({} as Plan);
          setPlanData({ ...(data.data() as Plan) });
        });
        const GuestsIds = planData.guests;
        const guestsData: User[] = [];
        for (const guestId of GuestsIds) {
          const docRef = doc(db, "Usuarios", guestId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            guestsData.push(docSnap.data() as User);
          }
        }
        setGuests(guestsData);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
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
        <Text style={styles.titleCard}>{planData.name}</Text>
        <Rating size={24} />
        <Text style={styles.subTitleCard}>Detalles</Text>
        <Text style={styles.cardDescription}>{planData.description}</Text>
        <View style={styles.cardDivider} />
        <Text style={styles.subTitleCard}>Asistentes</Text>
        <ScrollView horizontal>
          {guests.map((guest, index) => (
            <Image
              key={index}
              source={{
                uri: (guest?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    guest?.firstName.split(" ")[0]
                  }+${
                    guest?.lastName.split(" ")[0]
                  }&background=random&color=fff`) as string,
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
              }}
            />
          ))}
        </ScrollView>
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
    marginBottom: 10,
  },
  subTitleCard: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
  },
});
