import { Button } from "@rneui/base";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import {getActualDate} from "../../commons/utils"
import Header2 from "../../components/Header2";
import Icons from "../../components/Icons";
import StyledText from "../../components/StyledText";
import { productos } from "../../services/ProductoService";
import {
  db_insertCategoria,
  db_insertProducto,
  db_insertStock,
} from "../../services/SqliteService";
import theme from "../../theme/theme";

export default function DescargarArchivos({ navigation }) {
  const [estado, setEstado] = useState(false);
  //const [first, setfirst] = useState(second);
  // const [appIsReady, setAppIsready] = useState(false);
  //const { setSincronizado } = useContext(SessionContext);
  useEffect(() => {
    if (estado == false) {
      return;
    }
    setTimeout(() => {
      //setSincronizado(true);
      setEstado(false);
    }, 1000);
  }, [estado]);

  const inserCategories = () => {
    if (true) {
      db_insertCategoria(4, "Harinas Integrales");
    }
  };
  const inserPorductos = () => {
    if (true) {
      productos.forEach((element, index) => {
        db_insertProducto(
          element.idSap,
          element.descripcion,
          element.imagen,
          element.iva,
          element.precioVenta,
          index
        );
      });
    }
    inserStock();
  };

  const inserStock = () => {
    if (true) {
      db_insertStock(2, 1, 1, 30, 40, getActualDate());
    }
  };
  return (
    <View style={styles.container}>
      <Header2 back />
      <Spinner
        visible={estado}
        textContent={"Descargando..."}
        textStyle={{ color: "white" }}
        color="white"
        overlayColor="rgba(3, 3, 3, 0.52)"
        //textStyle={{ color: "white" }}
      />
      <StyledText heading center bold style={styles.title}>
        DESCARGAS
      </StyledText>
      <View
        style={{
          paddingHorizontal: 80,
          justifyContent: "center",
          flex: 1,
          paddingBottom: 55,
        }}
      >
        <StyledText subtitle bold>
          Productos:
        </StyledText>
        <Button
          title="Descargar "
          icon={<Icons download color={theme.colors.white} />}
          iconRight
          size="lg"
          color={theme.colors.modernaRed}
          buttonStyle={{ borderRadius: 10, marginBottom: 50, marginTop: 15 }}
          onPress={() => {
            inserCategories();
            inserPorductos();
            setEstado(true);
          }}
        />
        <StyledText subtitle bold>
          Clientes:
        </StyledText>
        <Button
          title="Descargar "
          icon={<Icons download color={theme.colors.white} />}
          iconRight
          size="lg"
          color={theme.colors.modernaRed}
          buttonStyle={{ borderRadius: 10, marginBottom: 50, marginTop: 15 }}
          onPress={() => {
            setEstado(true);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
});
