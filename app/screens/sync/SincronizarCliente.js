import { FAB } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import SincronizarListItems from "./SincronizarListItems";
import Header2 from "../../components/Header2"
export default function SincronizarClientes({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Header2 back/>
      <SincronizarListItems title="Clientes" clientes />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
});
