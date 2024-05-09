import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import PlanStep from "@/layout/PlanStep";
import { useNewPlanStore } from "@/store/newPlan-store";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/store/user-store";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  GeoPoint,
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../_infrastructure/firebase";
import { router } from "expo-router";
import { Image } from "expo-image";

const step4 = () => {
  const setCurrentStep = useNewPlanStore((state) => state.setCurrent);
  const currentStep = useNewPlanStore((state) => state.current);

  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickImage = async () => {
    //console.log("------>" + useUserStore.getState().uid);
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  // From step 1
  const name = useNewPlanStore((state) => state.name);
  const description = useNewPlanStore((state) => state.description);
  // From step 2
  const dateStart = useNewPlanStore((state) => state.dateStart);
  const dateEnd = useNewPlanStore((state) => state.dateEnd);
  const labels = useNewPlanStore((state) => state.labels);
  // From step 3
  const address = useNewPlanStore((state) => state.direccion);

  const resetValues = useNewPlanStore((state) => state.resetValues);

  const handleCrearPlan = async () => {
    setIsLoading(true);
    const { uid } = useUserStore.getState();
    const userId = uid;
    try {
      try {
        const uri = image as string;
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const filename = uri.substring(uri.lastIndexOf("/") + 1);
        const storageRef = ref(storage, `planes/${userId}/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob as Blob);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + Math.round(progress) + "% done");
            setProgress(progress);
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.error("Error uploading image: ", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                setImageUrl(downloadURL);

                await addDoc(collection(db, "Direcciones"), {
                  alias: name,
                  city: address.city,
                  coordinates: new GeoPoint(
                    address.coordinates.latitude,
                    address.coordinates.longitude
                  ),
                  idUser: userId,
                  state: address.state,
                  street: address.street,
                  zipCode: address.zipCode,
                })
                  .then(async (adressRef) => {
                    await updateDoc(adressRef, { uid: adressRef.id });

                    const userDoc = await getDoc(doc(db, `Usuarios/${userId}`));
                    await updateDoc(doc(db, `Usuarios/${userId}`), {
                      direcciones: [
                        ...userDoc?.data()?.direcciones,
                        adressRef.id,
                      ],
                    });

                    await addDoc(collection(db, "Planes"), {
                      coordinates: new GeoPoint(
                        address.coordinates.latitude,
                        address.coordinates.longitude
                      ),
                      dateEnd: dateEnd,
                      dateStart: dateStart,
                      description: description,
                      guests: [],
                      idAdmin: userId,
                      idDireccion: adressRef.id,
                      idValoracion: "",
                      labels: labels,
                      name: name,
                      picture: downloadURL,
                      requests: [],
                      score: 0,
                    })
                      .then((planRef) => {
                        updateDoc(planRef, { uid: planRef.id });
                      })
                      .catch((error) => {
                        console.error("Error adding plan: ", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error adding address: ", error);
                  })
                  .finally(() => {
                    setIsLoading(false);
                    resetValues();
                    alert("Plan añadido!🥳");
                    router.replace("/(tabs)");
                  });
              }
            );
          }
        );
      } catch (error) {
        console.error("Error uploading image: ", error);
        setIsLoading(false);
      }

      // console.log("Plan added from user: ", userId);
    } catch (error) {
      console.error("Error adding plan: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentStep(4);
  }, []);

  return (
    <PlanStep
      current={currentStep}
      onPress={() => {
        console.log("====================================");
        console.log("Step 4");
        handleCrearPlan();
        console.log("====================================");
      }}
      isDisabled={image === null}
      isLoading={isLoading}
    >
      <View>
        <Text style={[styles.title, { marginTop: 20 }]}>
          Selecciona una imagen{"\n"}para tu plan
        </Text>
        {/* Imagen */}
        <Text style={{ marginBottom: 10 }}>
          Una foto vale más que mil palabras, selecciona una imagen que
          represente tu plan
        </Text>
        <TouchableOpacity style={styles.userCardContainer} onPress={pickImage}>
          {!image ? (
            <Text style={styles.overlayText}>Selecciona una imagen</Text>
          ) : (
            <Text style={[styles.overlayText, { left: "58%" }]}>
              Modificar imagen
            </Text>
          )}
          {image ? (
            <Image
              contentFit="cover"
              source={{ uri: image }}
              style={styles.userCardImage}
            />
          ) : (
            <Image
              contentFit="cover"
              source={require("../../../assets/plan.jpg")}
              style={styles.userCardImage}
            />
          )}
        </TouchableOpacity>
        {progress > 0 && (
          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {progress.toFixed(2) + "%"}
          </Text>
        )}
      </View>
    </PlanStep>
  );
};

export default step4;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userCardContainer: {
    display: "flex",
    flexDirection: "column",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
    height: 350,
    marginBottom: 15,
    position: "relative",
    zIndex: 1,
  },
  overlayText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -100 }, { translateY: -10 }],
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffffcf",
    zIndex: 1,
  },
  userCardImage: {
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    // resizeMode: "cover",
    borderRadius: 10,
  },
});
