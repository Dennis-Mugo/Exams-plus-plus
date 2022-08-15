import React from "react";
import { Text, View } from "react-native";

const CustomDivider = ({ text, style }) => (
  <View style={{ alignItems: "center" }}>
    <View
      style={{
        flexDirection: "row",
        marginVertical: 15,
        width: "95%",
        ...style,
      }}
    >
      <View
        style={{
          backgroundColor: "lightgray",
          height: 0.75,
          flex: 1,
          alignSelf: "center",
        }}
      />
      <Text
        style={{
          alignSelf: "center",
          paddingHorizontal: 5,
          fontFamily: "Nunito-Regular",
          color: "grey",
          fontSize: 14,
          color: "darkorchid",
        }}
      >
        {text}
      </Text>
      <View
        style={{
          backgroundColor: "lightgray",
          height: 0.75,
          flex: 1,
          alignSelf: "center",
        }}
      />
    </View>
  </View>
);

export default CustomDivider;
