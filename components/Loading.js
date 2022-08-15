import React from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import utilColors from "../utils/colors";

const Loading = ({ color }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Loading;
