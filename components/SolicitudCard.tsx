import { db } from "@/app/_infrastructure/firebase";
import { Solicitud } from "@/types/Solicitud";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

export const SolicitudCard = (props: Solicitud) => {
  interface Solicitud {
    // Otras propiedades de Solicitud
    guests: string[];
    solicitud: string[];
  }

  const aceptarSol = async () => {
    console.log("eliminamos de solicitud del plan", props.idUsuario);

    try {
      const docRef = doc(db, "Planes", props.planId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Obtener los datos del documento
        const docData = docSnap.data();

        // Obtener la lista actual de invitados o crear una nueva si no existe
        const guests = docData.guests || [];

        // Crear un nuevo objeto de datos con el usuario añadido a la lista de invitados
        const newData: Partial<Solicitud> = {
          ...docData, // Incluir todas las propiedades existentes
          guests: [...guests, props.idUsuario.toString()], // Agregar userId al campo guests
          solicitud:
            docData.solicitud?.length === 1
              ? []
              : docData.solicitud.filter((id: string) => id !== props.idUsuario), // Eliminar userId de la lista de solicitudes
        };

        // Actualizar el documento con el nuevo objeto de datos
        await updateDoc(docRef, newData);

        console.log(
          "Usuario movido de la lista de solicitudes a la lista de invitados en Firestore"
        );
        
      } else {
        console.log("El documento no existe en Firestore");
      }
    } catch (error) {
      console.error(
        "Error al mover el usuario de la lista de solicitudes a la lista de invitados:",
        error
      );
      throw error;
    }
  };

  const eliminarSol = async () => {
    console.log("eliminamos de solicitud del plan", props.idUsuario);

    try {
      // Obtener el documento

      const docRef = doc(db, "Planes", props.planId);
      const docSnap = await getDoc(docRef);
      // Verificar si el documento existe

      if (docSnap.exists()) {
        // Obtener el vector del documento
        const datos = docSnap.data();
        const nuevoVector = datos.solicitud.filter(
          (elem: String) => elem !== props.idUsuario
        );
        console.log("idUsuario: " + props.idUsuario);

        await updateDoc(docRef, { solicitud: nuevoVector });

        console.log("Elemento eliminado correctamente");
      } else {
        console.log("El documento no existe");
      }
    } catch (error) {
      console.error("Error al eliminar elemento:", error);
    }
  };

  const [username, setUsername] = useState("");

  useEffect(() => {
    let name = `${props?.firstName?.split(" ")[0]} ${props?.lastName}`;
    if (name.length > 20) {
      name = name.substring(0, 20) + "...";
    }
    setUsername(name);
  }, []);

  return (
    <View style={styles.container}>
      {/* Foto a la izquierda */}
      <Image source={{ uri: props.avatar.toString() }} style={styles.image} />
      <Text style={styles.username}>{username}</Text>

      {/* Botón verde en el medio */}
      <TouchableOpacity
        style={[styles.button, styles.greenButton]}
        onPress={() => {
          aceptarSol();
        }}
      >
        <Text style={styles.buttonText}>Aceptar </Text>
      </TouchableOpacity>

      {/* Botón rojo a la derecha */}
      <TouchableOpacity
        style={[styles.button, styles.redButton]}
        onPress={() => {
          eliminarSol();
        }}
      >
        <Text style={styles.buttonText}>Rechazar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 16,
    width: 120,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  greenButton: {
    backgroundColor: "green",
  },
  redButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
