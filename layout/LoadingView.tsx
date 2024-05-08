import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface LoadingViewProps {
  style?: StyleProp<ViewStyle>;
  sizeLoader?: "large" | "small";
  colorLoader?: string;
  text: string;
  textStyle?: StyleProp<TextStyle>;
}

const LoadingView = ({
  style,
  sizeLoader = "large",
  colorLoader = "#FF9500",
  text,
  textStyle,
}: LoadingViewProps) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={sizeLoader} color={colorLoader} />
      <Text style={[{ marginTop: 10 }, textStyle]}>{text}</Text>
    </View>
  );
};

export default LoadingView;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
});
