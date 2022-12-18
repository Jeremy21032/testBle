import { useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { es_EC } from "../../commons/texts";
import Icons from "../../components/Icons";
import SearhInput from "../../components/SearchInput";
import StyledText from "../../components/StyledText";
import { NavigationContext } from "../../context/NavigationProvider";
import { consultarPedidos } from "../../services/PedidoService";
import theme from "../../theme/theme";
import PedidoShortCard from "./PedidoShortCard";

export default function PedidosList({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const {setActivate}=useContext(NavigationContext);
  
  const obtenerPedidos = () => {
    consultarPedidos(search, setPedidos);
  };
  useEffect(() => {
    obtenerPedidos();
    const willFocusSubscription = navigation?.addListener("focus", () => {
      obtenerPedidos();
    });

    return willFocusSubscription;
  }, []);

  useEffect(() => {
    //buscarClientes();
    obtenerPedidos();
    setActivate(false);
    const willFocusSubscription = navigation.addListener("focus", () => {
      //buscarClientes();
      obtenerPedidos();
      setActivate(false);
    });

    return willFocusSubscription;
  }, []);

  useEffect(() => {
    obtenerPedidos();
  }, [search]);

  return (
    <View style={styles.container}>
      <StyledText bold center heading style={styles.title}>
        PEDIDOS
      </StyledText>
      <SearhInput
        onSubmit={obtenerPedidos}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        placeholder="Buscar pedido"
        label={es_EC.LABEL_BUSQUEDA}
      />
      <View style={styles.information}>
        <View style={styles.infodetail}>
          <View style={styles.square} />
          <StyledText style={styles.message}>Pedido con stock</StyledText>
        </View>
        <View style={styles.information} />
        <View style={styles.infodetail}>
          <View
            style={[styles.square, { borderColor: theme.colors.modernaRed }]}
          />
          <StyledText style={styles.message} color={theme.colors.modernaRed}>
            Pedido sin stock
          </StyledText>
        </View>
      </View>
      {!pedidos || pedidos.length === 0 ? (
        <View style={styles.container}>
          <StyledText center title bold>
            {search !== "" ? "No hay resultados" : "No hay pedidos"}
          </StyledText>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          keyExtractor={(item) => item.idPedido}
          data={pedidos}
          renderItem={({ item }) => {
            return (
              <PedidoShortCard
                pedido={item}
                navigation={navigation}
                withoutbuttons={true}
                isChecked={item.sincronizado}
              />
            );
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  list: {
    marginTop: 0,
    marginBottom: 50,
    paddingHorizontal: 5,
  },
  search: {
    marginBottom: 0,
  },
  information: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  infodetail: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  message: { flex: 5, flexWrap: "wrap" },
  title: {
    marginBottom: 15,
  },
  square: {
    width: 30,
    height: 30,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    //borderTopWidth: 0.5,
    //borderLeftWidth: 0.5,
    marginRight: 4,
  },
});
