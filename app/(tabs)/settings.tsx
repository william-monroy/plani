import { View, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";

const SettingsPage = () => {
  return (
    <View>
      <Button title="Sign Out" onPress={async () => await signOut(getAuth())} />
    </View>
  );
};

export default SettingsPage;
