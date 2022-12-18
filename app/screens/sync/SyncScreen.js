import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
import Constants from "expo-constants";
import theme from "../../theme/theme";
import SincronizarClientes from "./SincronizarCliente";
import SincronizarPedidos from "./SincronizarPedidos";
import DescargarArchivos from "./DescargarArchivos";
import { useState } from "react";
import Icons from "../../components/Icons";
import { Icon } from "@rneui/base";

export default function SyncScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "clientes",
      title: "Favorites",
      focusedIcon: "user",
      unfocusedIcon: "user",
    },
    {
      key: "pedidos",
      title: "Favorites",
      focusedIcon: "dropbox",
      unfocusedIcon: "dropbox",
    },
    {
      key: "descargas",
      title: "Favorites",
      focusedIcon: "download",
      unfocusedIcon: "download",
    },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    clientes: SincronizarClientes,
    pedidos: SincronizarPedidos,
    descargas: DescargarArchivos,
  });

  return (
    <BottomNavigation
      barStyle={styles.tabbar}
      style={styles.tab}
      inactiveColor={theme.colors.white}
      labeled={false}
      compact
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tab: { flex: 1, padding: 0 },
  tabbar: {
    // height: Constants.statusBarHeight,
    height:50,
    justifyContent: "center",
    // marginBottom: Constants.statusBarHeight / 3,
    backgroundColor: theme.colors.modernaRed,
  },
});
