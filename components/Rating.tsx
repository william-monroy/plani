import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface RatingProps {
  size: number;
  color?: `#${string}`;
  onChangeValue?: (newValue: number) => void;
}

const Rating = ({ size, color = "#ffce04", onChangeValue }: RatingProps) => {
  const [value, setValue] = useState<number>(0);

  const handleValueChange = (newValue: number) => {
    setValue(newValue); // Actualizamos el estado local
    if (onChangeValue) {
      onChangeValue(newValue); // Llamamos a la función de callback si está definida
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleValueChange(1)}>
        <Ionicons
          name={value >= 1 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleValueChange(2)}>
        <Ionicons
          name={value >= 2 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleValueChange(3)}>
        <Ionicons
          name={value >= 3 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleValueChange(4)}>
        <Ionicons
          name={value >= 4 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleValueChange(5)}>
        <Ionicons
          name={value >= 5 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
