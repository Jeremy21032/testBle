import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Icons from "../../components/Icons";
import StyledText from "../../components/StyledText";
import { PedidoContext } from "../../context/PedidoContext";
import { findClientById } from "../../services/ClienteService";
import { consultarDetallePedido } from "../../services/PedidoService";
import theme from "../../theme/theme";

export default function PedidoShortCard({
  pedido,
  isChecked,
  navigation,
  onCheckTouch,
}) {
  const [clienteCard, setClienteCard] = useState("");
  const { setPedido, setCliente, setCarrito } = useContext(PedidoContext);

  useEffect(() => {
    findClientById(pedido.idCliente, setClienteCard);
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setPedido(pedido);
        setCliente(clienteCard);
        consultarDetallePedido(pedido.idPedido, setCarrito);
        navigation?.navigate("PedidoResumen", { notNew: true });
      }}
    >
      <View
        style={[styles.card, pedido?.textoFactura !== "" && styles.nostock]}
      >
        <View style={styles.left}>
          <View style={styles.information}>
            <StyledText bold>PEDIDO #{pedido?.idPedido}</StyledText>
            <StyledText light>{pedido?.fecha}</StyledText>
          </View>
          <StyledText>{clienteCard?.nombre}</StyledText>
          <StyledText light>{clienteCard?.identificacion}</StyledText>
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            onPress={() => {
              if (onCheckTouch != null) {
                onCheckTouch();
              }
            }}
          >
            <Icons
              check
              color={
                isChecked === 1 || isChecked === true
                  ? theme.colors.active
                  : theme.colors.inactive
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  nostock: {
    borderColor: theme.colors.modernaRed,
  },
  card: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 3,
    flexDirection: "row",
    //borderTopWidth: 0.3,
    // borderLeftWidth: 0.1,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    alignItems: "center",
  },
  left: {
    flex: 10,
  },
  right: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  information: { flexDirection: "row", justifyContent: "space-between" },
});
