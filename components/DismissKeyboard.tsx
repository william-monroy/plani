import {
  TouchableWithoutFeedback,
  Keyboard,
  View,
  KeyboardAvoidingView,
} from "react-native";

interface DismissKeyboardProps {
  children: React.ReactNode | React.ReactNode[];
  style?: any;
}

const DismissKeyboard = ({ children, style }: DismissKeyboardProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
