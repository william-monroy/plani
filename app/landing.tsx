import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={['white', '#FFD700', '#FF6347']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Bienvenido a Plani</Text>
        <Text style={styles.subtitle}>¿Estás listo para que te dejen plantado? 🌱</Text>
        <Text style={styles.text}>Haz planes con tus amigos, conoce gente nueva, haz algo diferente!🫂
        Únete Plani, harás esto y mucho más 😎 Pero sobre todo... Que no te dejen plantado!🌳 </Text>
        <Pressable style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.textButton}>Iniciar sesión</Text>
        </Pressable>
        <Text style={styles.text} onPress={() => router.push("/register")}>Crear una cuenta</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: '30%',
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    marginTop: '30%',
    marginBottom: 20,
    width: '75%',
    height: 40,
    backgroundColor: "white",
    borderRadius: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "orange",
    fontSize: 19,
    fontWeight: "700",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default LandingScreen;
