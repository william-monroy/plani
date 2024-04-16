import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface RatingProps {
  size: number;
  value: number;
  color?: `#${string}`;
}

const Rating = ({ size, value,  color = "#ffce04" }: RatingProps) => {

  return (
    <View style={styles.container}>
        <Ionicons
            name={value >= 1 ? "star" : "star-outline"}
            size={size}
            color={color}
        />
        <Ionicons
            name={value >= 2 ? "star" : "star-outline"}
            size={size}
            color={color}
        />
        <Ionicons
            name={value >= 3 ? "star" : "star-outline"}
            size={size}
            color={color}
        />
        <Ionicons
            name={value >= 4 ? "star" : "star-outline"}
            size={size}
            color={color}
        />
        <Ionicons
            name={value >= 5 ? "star" : "star-outline"}
            size={size}
            color={color}
        />
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
