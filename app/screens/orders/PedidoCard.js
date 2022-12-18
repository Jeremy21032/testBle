import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Icons from "../../components/Icons";
import StyledText from "../../components/StyledText";
import { getProductoById } from "../../services/ProductoService";

import theme from "../../theme/theme";

export default function PedidoCard({ pedido, withbuttons, eliminar, id }) {
  const [image, setImage] = useState(null);
  const [producto, setProducto] = useState("");

  useEffect(() => {
    if (withbuttons) {
      setProducto(pedido?.producto);
    } else {
      getProductoById(pedido?.idProducto, setProducto);
    }
  }, []);

  useEffect(() => {
    setImage(producto?.imagen);
  }, [producto]);

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.top}>
          <StyledText modernaPrimary bold subtitle>
            {producto?.descripcion}
          </StyledText>
          <StyledText color={theme.colors.lightgray} bold>
            {producto?.idSap}
          </StyledText>
        </View>
        <View style={styles.botton}>
          <StyledText bolder center>
            {producto?.iva === 1 && "*"}
          </StyledText>
          <Image
            style={[
              styles.logo,
              {
                height: 50,
                width: 50,
              },
            ]}
            source={{ uri: image }}
          />
          <View style={[styles.data, styles.cantidad]}>
            <StyledText center bold>
              Cant.
            </StyledText>
            <StyledText center>{pedido?.cantidad}</StyledText>
          </View>
          <View style={styles.data}>
            <StyledText center bold>
              P. Unitario
            </StyledText>
            <StyledText center>{pedido?.precioUnitario}</StyledText>
          </View>
          <View style={styles.data}>
            <StyledText center bold>
              Subtotal
            </StyledText>
            <StyledText center>{pedido?.subtotal}</StyledText>
          </View>
        </View>
      </View>
      {withbuttons === true && (
        <View style={styles.right}>
          <TouchableOpacity>
            <Icons edit color={theme.colors.modernaYellow} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => eliminar(id)}>
            <Icons eliminar color={"red"} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: 10,
    paddingHorizontal: 8,
    marginVertical: 1,
    flexDirection: "row",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 10,
  },
  botton: { flexDirection: "row" },
  left: {
    flex: 8,
  },
  right: {
    right: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  buttons: {
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  data: {
    flex: 6,
    backgroundColor: "#F0F0F0",
    margin: 2,
  },
  iconwithtext: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  cantidad: {
    flex: 3,
  },
});
