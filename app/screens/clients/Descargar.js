import { StyleSheet, Text, View } from "react-native";

export default function Descargar() {
  return (
    <View style={styles.container}>
      <Text>Sincronizar DESCARGAS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
