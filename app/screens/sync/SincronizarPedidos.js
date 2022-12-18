import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import SincronizarListItems from "./SincronizarListItems";
import Header2 from "../../components/Header2";

export default function SincronizarPedidos({ navigation }) {
  return (
    <View style={styles.container}>
      <Header2 back/>
      <SincronizarListItems title="Pedidos" pedidos />
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
