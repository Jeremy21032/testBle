import { Text, View, StyleSheet, Image } from "react-native";
import theme from "../../theme/theme";

export default function Splash() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/moderna/Logotipo-espiga-amarilla-letras-blancas.png")}
        style={{ width: 250, height: 80 }}
      />
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
