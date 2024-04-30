import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { Solicitud } from "@/types/Solicitud";
import { useLocalSearchParams } from "expo-router";
import { SolicitudCard } from "@/components/SolicitudCard";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/_infrastructure/firebase";

const SolicitudesScreen = () => {
  // const { planId } = useLocalSearchParams();
  const planId = "cCS3co1RKKNkXoQaHAs9";

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const getSolicitudes = async () => {
    // Lógica para obtener las solicitudes de un plan específico
    try {
      const planRef = doc(db, `Planes/${planId}`);
      onSnapshot(planRef, async (doc) => {
        if (doc.exists()) {
          const idUsuarios = doc.data()?.requests;
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
                console.log("user:", await user.data());
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
    }
  };

  useEffect(() => {
    getSolicitudes();
  }, []);

  return (
    <View>
      {solicitudes.map((solicitud: Solicitud, key: number) => (
        <SolicitudCard key={key} {...solicitud} />
      ))}
    </View>
  );
};

export default SolicitudesScreen;

const styles = StyleSheet.create({});
