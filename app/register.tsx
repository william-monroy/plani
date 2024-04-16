import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Link, router } from "expo-router";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import { db } from "./_infrastructure/firebase";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gender, User } from "@/types/User.type";
import { useUserStore } from "@/store/user-store";
import Button from "@/components/Button";

const RegisterScreen = () => {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState<Gender>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { update } = useUserStore((state) => state);

  const handleRegister = async () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (user) {
          const userDocRef = doc(db, "Usuarios", user.uid); // Crea una referencia al documento usando el uid del usuario
          try {
            await setDoc(userDocRef, {
              email: email,
              registered: new Date(),
              uid: user.uid,
              birthDate: birthDate,
              gender: gender,
              firstName: firstName,
              lastName: lastName,
              labels: [],
              direcciones: [],
              score: 0,
              avatar: `https://ui-avatars.com/api/?name=${
                firstName.split(" ")[0]
              }+${lastName.split(" ")[0]}&background=random&color=fff`,
            });
            console.log("user.user.uid: ", user.uid);
            // console.log("Document written with ID: ", docRef.id);
            update({
              email: email,
              registered: new Date(),
              uid: user.uid,
              dateBirth: birthDate,
              gender: gender,
              firstName: firstName,
              lastName: lastName,
              avatar: `https://ui-avatars.com/api/?name=${
                firstName.split(" ")[0]
              }+${lastName.split(" ")[0]}&background=random&color=fff`,
            });
            console.log("user.user.uid: ", user.uid);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          router.replace("preferences");
        }
      })
      .catch((err) => {
        alert(err?.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 1.5, y: 1.5 }}
        end={{ x: 0, y: 0 }}
        colors={["white", "#FFD700", "#FF6347"]}
        style={[{ paddingTop: insets.top }, styles.gradient]}
      >
        <Text style={styles.title}>Registrate 🌱</Text>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su nombre(s)"
          onChangeText={setFirstName}
        />
        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese sus apellidos"
          onChangeText={setLastName}
        />
        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su correo"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese su contraseña"
          secureTextEntry
          onChangeText={setPassword}
        />
        <View style={styles.row}>
          <View style={(styles.rowItem, { alignItems: "flex-start" })}>
            <Text style={styles.label}>Fecha de nacimiento</Text>
            {Platform.OS === "ios" ? (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(true);
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                    setShowDatePicker(false);
                  }
                }}
              />
            ) : (
              <Pressable
                style={[
                  styles.input,
                  {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{birthDate.toDateString()}</Text>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setBirthDate(selectedDate);
                        setShowDatePicker(false);
                      }
                    }}
                  />
                )}
              </Pressable>
            )}
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Género</Text>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
              mode="dropdown" // Asegúrate de establecer el modo adecuado
            >
              <Picker.Item label="Seleciona tu género" value="" />
              <Picker.Item label="Hombre" value="male" />
              <Picker.Item label="Mujer" value="female" />
              <Picker.Item label="Otro" value="other" />
            </Picker>
          </View>
        </View>

        <Button
          title="Crear Cuenta"
          onPress={handleRegister}
          disabled={false}
          loading={isLoading}
          variant="filled"
          size="medium"
          rounded={false}
          fullWidth
        />

        <Link href={"/login"} style={styles.text}>
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#121212",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 40,
    color: "#121212",
  },
  form: {
    width: "80%",
    marginTop: 50,
  },
  input: {
    height: 50,
    borderRadius: 15,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#121212",
  },

  button: {
    backgroundColor: "#f5a623",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    color: "#f6f6f6",
    fontSize: 19,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    color: "#542500",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  rowItem: {
    width: "50%",
  },
});

export default RegisterScreen;
