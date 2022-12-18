import React from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import StyledText from "./StyledText";

export default function ClienteCabecera({ cliente }) {
  return (
    <View style={styles.container}>
      <StyledText>
        {cliente ? cliente?.nombre : "Error, no se ha guardado el cliente"}
      </StyledText>
      <StyledText light>{cliente?.identificacion}</StyledText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "gray",
    width: Dimensions.get("window").width - 120,
    marginVertical: 15,
  },
});
