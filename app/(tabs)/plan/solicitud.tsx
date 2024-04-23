import { db } from "@/app/_infrastructure/firebase";
import { PlanCard } from "@/components/PlanCard";
import { SolicitudCard } from "@/components/SolicitudCard";
import { useUserStore } from "@/store/user-store";
import { Plan } from "@/types/Plan.type";
import { Solicitud } from "@/types/Solicitud";
import { useLocalSearchParams } from "expo-router";
import { User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SolicitudScreen() {
    const insets = useSafeAreaInsets();
    const planId = "HnlSbOVN0pis0vy8mWx7"
    
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [solicitudesId, setsolicitudesId] = useState<Solicitud[]>([]);

    const { uid } = useLocalSearchParams();  

    

    const getSolicitudData = async () => {
        try {
            const q = query(collection(db, "Planes"), where("uid", "==", planId));
            const querySnapshot = await getDocs(q);
            const firstDoc = querySnapshot.docs[0];
            if (firstDoc) {
                // Extraer el campo "solicitud" del documento
                const solicitud = firstDoc.data().solicitud;
                console.log("Solicitud:", solicitud);
                setSolicitudes([]);
                setsolicitudesId(solicitud); 
                getUsersData();
            } else {
                console.log("No se encontraron documentos.");
            }
        } catch (error) {
            console.error("Error getting solicitud data: ", error);
        }
    };


    const getUsersData = async () => {
        console.log("laaaaaaaaa   -",solicitudesId )
        try {
            const q = query(collection(db, "Usuarios"), where("uid", "in", solicitudesId));
            const querySnapshot = await getDocs(q);
            const userData: Solicitud[] = querySnapshot.docs.map((doc) => ({
                idUsuario: doc.id,
                avatar: doc.data().avatar,
                // Suponiendo que tienes los campos "firstName" y "lastName" en tus documentos de usuario
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                planId : planId
            }));
            console.log("Esto son los usuarios extraidos:  ",userData)
            setSolicitudes(userData);
        } catch (error) {
            console.log("Non User data ", error); 
        }
        setIsLoading(false);
    };
        // Función para recargar los datos
        const reloadData = () => {
            getSolicitudData(); 
        };

    useEffect(() => {
        reloadData()
        console.log(solicitudes)
        console.log("prueba")
    }, []); // Eliminar refreshData como dependencia



    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView style={styles.solicituds}> 
                {isLoading ? (
                    <Text>Loading users...</Text>
                )  : solicitudes.length === 0 ? (
                    <Text>No hay solicitudes</Text>
                ) : (
                    solicitudes.map((solicitud, index) => (
                        <SolicitudCard  onRefreshData={reloadData} key={index} avatar={solicitud.avatar || `https://ui-avatars.com/api/?name=${solicitud.firstName.split(" ")[0]}+${solicitud.lastName.split(" ")[0]}&background=random&color=fff`} idUsuario={solicitud.idUsuario} lastName={solicitud.lastName} firstName={solicitud.firstName} planId = {planId}/>
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
