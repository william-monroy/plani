import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
  disabled: boolean;
  loading: boolean;
  variant: "filled" | "outlined";
  size: "small" | "medium" | "large";
  fullWidth: boolean;
  rounded: boolean;
}

const filledButton = {
  backgroundColor: "#f5a623",
  color: "white",
};

const filledButtonDisabled = {
  backgroundColor: "#bab9b8",
  color: "#f6f6f6",
};

const outlinedButton = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#f6f6f6",
  color: "#f6f6f6",
};

const outlinedButtonDisabled = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#bab9b8",
  color: "#bab9b8",
};

const smallButton = {
  padding: 5,
};

const smallText = {
  fontSize: 14,
};

const mediumButton = {
  padding: 10,
};

const mediumText = {
  fontSize: 16,
};

const largeButton = {
  padding: 15,
};

const largeText = {
  fontSize: 20,
};

const fullWidthButton = {
  width: "100%",
};

const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        props.disabled
          ? props.variant === "filled"
            ? filledButtonDisabled
            : outlinedButtonDisabled
          : props.variant === "filled"
          ? filledButton
          : outlinedButton,
        props.size === "small"
          ? smallButton
          : props.size === "medium"
          ? mediumButton
          : largeButton,
        props.fullWidth
          ? fullWidthButton
          : {
              minWidth: "75%",
            },
        props.rounded ? { borderRadius: 50 } : {},
        props.style,
      ]}
      onPress={props.disabled ? undefined : props.onPress}
    >
      {props.loading ? (
        <ActivityIndicator
          color={props.variant === "filled" ? "white" : "#f6f6f6"}
        />
      ) : (
        <Text
          style={[
            styles.title,
            props.disabled
              ? props.variant === "filled"
                ? { color: filledButtonDisabled.color }
                : { color: outlinedButtonDisabled.color }
              : props.variant === "filled"
              ? { color: filledButton.color }
              : { color: outlinedButton.color },
            props.size === "small"
              ? smallText
              : props.size === "medium"
              ? mediumText
              : largeText,
          ]}
        >
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
