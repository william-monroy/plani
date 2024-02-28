import { Link, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const UserPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        // backgroundColor: "gray",
      }}
    >
      <Text>UserPage {id}</Text>
      <Link href="/" style={{ color: "blue" }}>
        Home
      </Link>
    </View>
  );
};

export default UserPage;
