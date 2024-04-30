import { db } from "@/app/_infrastructure/firebase";
import { SolicitudCard } from "@/components/SolicitudCard";
import { Solicitud } from "@/types/Solicitud";
import { useLocalSearchParams } from "expo-router";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SolicitudScreen() {
  const insets = useSafeAreaInsets();

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitudesId, setsolicitudesId] = useState<Solicitud[]>([]);
  const { id } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);

  const getSolicitudData = async () => {
    try {
      const q = query(collection(db, "Planes"), where("uid", "==", id));
      const querySnapshot = await getDocs(q);
      const firstDoc = querySnapshot.docs[0];

      if (firstDoc) {
        // Extraer el campo "solicitud" del documento
        setsolicitudesId([]);
        setSolicitudes([]);
        console.log("solicitudId" + solicitudesId);
        const solicitud = firstDoc.data().solicitud;
        console.log("Solicitud:", solicitud);
        await setsolicitudesId(solicitud);
        console.log("Aquiiiiiiiiiiii" + solicitudesId);

        getUsersData();
      } else {
        console.log("No se encontraron documentos.");
      }
    } catch (error) {
      console.error("Error getting solicitud data: ", error);
    }
  };

  const getUsersData = async () => {
    console.log("laaaaaaaaa   -", solicitudesId);

    const collectionRef = query(
      collection(db, "Usuarios"),
      where("uid", "in", solicitudesId)
    );

    await onSnapshot(collectionRef, async (data) => {
      //console.log("holaaaaaaaaaaaaaaa :"+JSON.stringify(data.docs,null,2));
      //await data.docs.map((doc) => {
      //})

      setSolicitudes(
        (await data.docs.map)
          ? await data.docs.map((solicitud: any) => {
              return {
                idUsuario: solicitud.idUsuario,
                avatar: solicitud.avatar,
                // Suponiendo que tienes los campos "firstName" y "lastName" en tus solicitudumentos de usuario
                firstName: solicitud.firstName,
                lastName: solicitud.lastName,
                planId: id,
              } as Solicitud;
            })
          : []
      );
    });

    try {
      const q = query(
        collection(db, "Usuarios"),
        where("uid", "in", solicitudesId)
      );
      const querySnapshot = await getDocs(q);
      const userData: Solicitud[] = querySnapshot.docs.map((doc) => ({
        idUsuario: doc.id,
        avatar: doc.data().avatar,
        // Suponiendo que tienes los campos "firstName" y "lastName" en tus documentos de usuario
        firstName: doc.data().firstName,
        lastName: doc.data().lastName,
        planId: id,
      }));
      console.log("Esto son los usuarios extraidos:  ", userData);
      if (userData != solicitudes) {
        setSolicitudes(userData);
      }
    } catch (error) {
      console.log("Non User data ", error);
    }
    setIsLoading(false);
  };

  const onRefresh = (x?: any) => {
    //getData();  // Puedes optar por llamar a getData o cualquier otra función que actualice tus datos
    setRefreshing(true);
    console.log("La solicitud que hemos eliminado es : " + x);
    setsolicitudesId([]);
    setSolicitudes([]);
    getSolicitudData();
    const solicitudEncontrada = solicitudes.find(
      (solicitud) => solicitud.idUsuario === x
    );

    if (solicitudEncontrada) {
      setSolicitudes(
        solicitudes.filter((solicitud) => solicitud.idUsuario !== x)
      );
      console.log("solicitudes a enseñar " + solicitudes);
    } else {
      console.log("La solicitud no fue encontrada en el vector.");
    }
    setRefreshing(false);
  };

  useEffect(() => {
    // reloadData();
    console.log(solicitudes);
    console.log("esteeeeeeee ---- " + id);
  }, [id]); // Eliminar refreshData como dependencia

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(
          collection(db, "Usuarios"),
          where("uid", "in", solicitudesId)
        );
        const querySnapshot = await getDocs(q);
        const userData: Solicitud[] = querySnapshot.docs.map((doc) => ({
          idUsuario: doc.id,
          avatar: doc.data().avatar,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          planId: id,
        }));
        console.log("userData:", userData);
        setSolicitudes(userData);
      } catch (error) {
        console.log("Non User data ", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [solicitudesId]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.solicituds}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <Text>Loading users...</Text>
        ) : solicitudes.length === 0 ? (
          <Text>No hay solicitudes</Text>
        ) : (
          solicitudes.map((solicitud, index) => (
            <SolicitudCard
              // onRefreshData={reloadData}
              key={index}
              avatar={
                solicitud.avatar ||
                `https://ui-avatars.com/api/?name=${
                  solicitud.firstName?.split(" ")[0]
                }+${
                  solicitud.lastName?.split(" ")[0]
                }&background=random&color=fff`
              }
              idUsuario={solicitud.idUsuario}
              lastName={solicitud.lastName}
              firstName={solicitud.firstName}
              planId={id}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  solicituds: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
