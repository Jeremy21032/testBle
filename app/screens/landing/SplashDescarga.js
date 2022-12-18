import { Text, View, StyleSheet, Image } from "react-native";
import theme from "../../theme/theme";

export default function SplashDescarga() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/moderna/Logotipo-espiga-amarilla-letras-blancas.png")}
        style={{ width: 250, height: 80 }}
      />
      <Text>Descargando lo diario</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.modernaRed,
    alignItems: "center",
    justifyContent: "center",
  },
});
