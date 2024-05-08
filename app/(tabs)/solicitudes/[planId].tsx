import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { Solicitud } from "@/types/Solicitud";
import { router, useLocalSearchParams } from "expo-router";
import { SolicitudCard } from "@/components/SolicitudCard";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const SolicitudesScreen = () => {
  const { planId } = useLocalSearchParams();

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getSolicitudes = async () => {
    // Lógica para obtener las solicitudes de un plan específico
    try {
      setIsLoading(true);
      const planRef = doc(db, `Planes/${planId}`);
      onSnapshot(planRef, async (doc) => {
        if (doc.exists()) {
          const idUsuarios = doc.data()?.solicitud;
          if (!idUsuarios || idUsuarios.length === 0) {
            console.log("No hay solicitudes pendientes");
            setSolicitudes([]);
          } else {
            const collectionRef = query(
              collection(db, "Usuarios"),
              where("uid", "in", idUsuarios)
            );
            await getDocs(collectionRef).then(async (data) => {
              const getData = await data.docs.map(async (user: any) => {
                // console.log("user:", await user.data());
                return {
                  idUsuario: user.data().uid,
                  avatar: user.data().avatar,
                  firstName: user.data().firstName,
                  lastName: user.data().lastName,
                  planId: planId,
                } as Solicitud;
              });
              setSolicitudes(await Promise.all(getData));
            });
          }
        } else {
          console.log(`No se encontró el documento Planes/${planId}.requests`);
        }
      });
    } catch (error) {
      console.log("Error al obtener las solicitudes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSolicitudes();

  }, [planId]);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            style={styles.icon}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Solicitudes</Text>
      </View>
      <ScrollView>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#f5a623"
              style={{ marginBottom: 15 }}
            />
            <Text>Cargando solicitudes...</Text>
          </View>
        ) : solicitudes.length === 0 ? (
          <View style={styles.loadingContainer}>
            <FontAwesome5
              name="inbox"
              size={28}
              color="#aeaeae"
              style={{ marginBottom: 15 }}
            />
            <Text style={{ fontSize: 16 }}>No hay solicitudes</Text>
          </View>
        ) : (
          <View>
            {solicitudes.map((solicitud: Solicitud, key: number) => (
              <SolicitudCard key={key} {...solicitud} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default SolicitudesScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    height: 600,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  icon: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
