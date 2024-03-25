import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface RatingProps {
  size: number;
  color?: `#${string}`;
}

const Rating = ({ size, color = "#ffce04" }: RatingProps) => {
  const [value, setValue] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setValue(1)}>
        <Ionicons
          name={value >= 1 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setValue(2)}>
        <Ionicons
          name={value >= 2 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setValue(3)}>
        <Ionicons
          name={value >= 3 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setValue(4)}>
        <Ionicons
          name={value >= 4 ? "star" : "star-outline"}
          size={size}
          color={color}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setValue(5)}>
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
