import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import theme from "../../theme/theme";
import { useContext, useEffect, useState } from "react";
import PedidoCard from "./PedidoCard";
import StyledText from "../../components/StyledText";

import StyledButton from "../../components/StyledButton";
import Header from "../../components/Header";
import { generateUIDD, getActualDate, to2Decimals } from "../../commons/utils";
import { calcularFacturaPedido } from "../../services/CarritoService";
import ClienteCabecera from "../../components/ClienteCabecera";
import { PedidoContext } from "../../context/PedidoContext";
import { db_insertPedido } from "../../services/SqliteService";
import { findClientById, registerClient } from "../../services/ClienteService";
import {
  consultarDetallePedido,
  insertarDetallePedido,
} from "../../services/PedidoService";
import ModalModerna from "../../components/ModalModerna";
import { ConectarImpresora } from "../../services/ImpresoraService";
import { printer1 } from "../../services/ImpresoraService";

export default function PedidoResumenSinStock({ route, navigation }) {
  const notNew = route?.params?.notNew;
  const [factura, setFactura] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    //info sub,total,iva
    pedido,
    setPedido,
    //productos    //datos cliente
    cliente,
    setCliente,
    carritoWithNoStock,
    setCarritoWithNoStock,limpiarCarritos,
    removerProductoDelCarritoSinStock,
  } = useContext(PedidoContext);
  const idPedido = notNew ? pedido?.idPedido : generateUIDD();

  const [printer, setprinter] = useState();

  // const verCarrito = () => {
  //   pedido?.detallePedido?.array.forEach(element => {
  //     console.log(element.Nombre);
  //   });
  // }

  //zpl
  var text = "palalbe";
  var ruc = "Ruc";
  var tele = "Telefono";
  var prueba = "^FD2MODERNA ALIMENTOS";
  // var iva=factura.iva
  // var ENCABEZADO2 = "^XA^FX Top section with logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^FO75,75^R^GB100,100,100^FS^FO93,93^GB40,40,40^FS^FO220,50" + prueba + "^FS^CF0,30^FO220,115^FDNombre:" + text + "^FS^FO220,155^FDRuc:" + ruc + "^FS^FO220,195^FDTelefono:" + tele + "^FS^FO50,250^GB700,3,3^FS^FX Second section with recipient address and permit information.^CFA,30^FO50,300^FDSe supone que aqui van los productos!!!!^FS^FO50,340^Producto1^FS^FO50,380^FDProducto2^FS^FO50,420^FDProducto3^FS^CFA,15^FO600,300^GB150,150,3^FS^FO638,340^FDPermit^FS^FO638,390^FD123456^FS^FO50,500^GB700,3,3^FS^FX Third section with bar code.^BY5,2,270^FO100,550^BC^FD12345678^FS^FX Fourth section (the two boxes on the bottom).^FO50,900^GB700,250,3^FS^FO400,900^GB3,250,3^FS^CF0,40^FO100,960^FDCtr. X34B-1^FS^FO100,1010^FDREF1 F00B47^FS^FO100,1060^FDREF2 BL4H8^FS^CF0,190^FO470,955^FDCA^FS^XZ";
  var MensajeFinal =
    "^FS^FO1,540^ADN,0.2,0.8^FD*Este documento no constituye ^FS^FO1,560^ADN,0.2,0.8^FDvalor tributario.";
  var linea2 = "^FS^FO80,500^GB400,1,4";
  var FirmaVendedor = "^FS^FO100,450^ADN,25,10^FDFirma Vendedor:";
  var Subtotal =
    "^FS^FO30,420^ADN,25,10^FDSubtotal:" + notNew
      ? pedido?.subtotal
      : factura.subtotal;
  var iva = "^FS^FO30,400^ADN,25,10^FDIVA:" + pedido?.iva;
  var ZonaProductos = "^FS^FO100,320^ADN,25,10^FDAQUI VAN LOS PRODUCTOS";
  var CodPedido = "^FS^FO20,300^ADN,25,10^FDNumero de Pedido:" + idPedido;
  var Fecha =
    "^FS^FO20,280^ADN,25,10^FDFecha:" + notNew
      ? pedido?.fecha
      : getActualDate();
  var Vendedor = "^FS^FO20,260^ADN,25,10^FDVendedor:";
  var telegono = "^FS^FO20,240^ADN,25,10^FDTelefono:" + cliente.telefono;
  var dIRECI = "^FS^FO20,220^ADN,25,10^FDDireccion:" + cliente.direccion;
  var RUCcED =
    "^FS^FO20,200^ADN,25,10^FDRuc o Cedula:" + cliente.identificacion;
  var Nombre = "^FS^FO20,180^ADN,25,10^FDNombre:" + cliente.nombre;

  var linea = "^FS^FO20,170^GB400,1,4";
  var TipoPedido = "^FS^FO100,150^ADN,25,10^FDTipo de Pedido:";
  var Ruc = "^FS^FO20,120^ADN,25,10^FD2Ruc:" + cliente.identificacion;
  var Telefono = "^FS^FO20,100^ADN,25,10^FDTelefono:" + cliente.telefono;
  var Direccion = "^FS^FO20,80^ADN,25,10^FDDireccion:" + cliente.direccion;
  var FirmaVendedor = "^FS^FO100,450^ADN,25,10^FDFirma Vendedor:";
  var ENCABEZADO =
    "^XA  ^FO0,00^ADN,63,20^FDMODERNA ALIMENTOS    " +
    Direccion +
    Telefono +
    Ruc +
    TipoPedido +
    linea +
    Nombre +
    RUCcED +
    dIRECI +
    telegono +
    Vendedor +
    Fecha +
    CodPedido +
    ZonaProductos +
    iva +
    Subtotal +
    FirmaVendedor +
    linea2 +
    MensajeFinal +
    "     ^XZ ";

  const imprimir = () => {
    printer1(ENCABEZADO, printer);
  };

  useEffect(() => {
    if (pedido && notNew === false) {
      findClientById(pedido?.idCliente, setCliente);
      consultarDetallePedido(pedido?.idPedido, setCarritoWithNoStock);
    }
  }, [pedido]);

  useEffect(() => {
    if (carritoWithNoStock) {
      setFactura(
        notNew === true
          ? { iva: pedido?.iva, subtotal: pedido?.subtotal }
          : calcularFacturaPedido(carritoWithNoStock)
      );
    }
  }, [carritoWithNoStock]);

  async function connect() {
    //await ConectarImpresora(setprinter);
  }

  useEffect(() => {
    connect();
  }, []);

  const eliminarProductoRefresh = (id) => {
    removerProductoDelCarritoSinStock(id);
  };
  const cancelarPedido = () => {
    setCarritoWithNoStock([]);
    setCliente(null);
    setPedido(null);
    navigation.navigate("ClientesStack2");
  };

  const guardarPedidoYCliente = () => {
    limpiarCarritos();
    navigation.navigate("ClientesList");
  };
  return (
    <View style={styles.container}>
      {/* ______________________________MODAL____________________________________ */}
      <ModalModerna
        title="¿Está seguro/a de cancelar el pedido?"
        subtitle="El cliente se borrará"
        setVisible={setDeleteModal}
        visible={deleteModal}
        onSubmit={cancelarPedido}
      />
      <ModalModerna
        title="¿Desea guardar pedido?"
        setVisible={setModalVisible}
        visible={modalVisible}
        onSubmit={guardarPedidoYCliente}
      />
      <ModalModerna
        title="¿Algo a ido mal desea reimprimir?"
        setVisible={setModalVisible2}
        visible={modalVisible2}
        onSubmit={guardarPedidoYCliente}
      />
      <Header back={() => navigation?.goBack()} />
      <View style={styles.subcontainer}>
        <StyledText heading bold center>
          {pedido && pedido?.textoFactura === "" && notNew === true
            ? "REIMPRESION PEDIDO"
            : "RESUMEN DE PEDIDO"}
        </StyledText>
        <StyledText light center>
          {`Fecha emisión: ${
            notNew === true ? pedido?.fecha : getActualDate()
          }`}
        </StyledText>
        <View style={{ alignItems: "center" }}>
          {notNew === true
            ? pedido?.textoFactura !== "" && (
                <StyledText style={{ marginTop: 5 }} bold modernaPrimary>
                  Pedido sin stock
                </StyledText>
              )
            : carritoWithNoStock?.length > 0 && (
                <StyledText style={{ marginTop: 5 }} bold modernaPrimary>
                  Pedido sin stock
                </StyledText>
              )}
          <View style={{ marginTop: -10 }}>
            <ClienteCabecera cliente={cliente} />
          </View>
        </View>
        <View style={styles.cajaCuerpo}>
          <StyledText heading modernaPrimary bold>
            $ {factura?.subtotal + factura?.iva}
          </StyledText>
          <Text style={[styles.cajaTitulo, { color: "#ffff" }]}>Resumen: </Text>
          <View style={styles.cajaResumen}>
            <View style={styles.resumen}>
              <StyledText bold>Subtotal</StyledText>
              <StyledText bold>$ {to2Decimals(factura?.subtotal)}</StyledText>
            </View>
            <View style={styles.resumen}>
              <StyledText bold>IVA</StyledText>
              <StyledText bold>$ {to2Decimals(factura?.iva)}</StyledText>
            </View>
            <View style={styles.resumen}>
              <StyledText bold>Total</StyledText>
              <StyledText bold>
                $ {to2Decimals(factura?.subtotal + factura?.iva)}
              </StyledText>
            </View>
          </View>
          {/* _____________________________________________Codigo Generado_____________________________ */}
          <StyledText heading modernaPrimary bold>
            {idPedido}
          </StyledText>
          {/* _________________________________________ */}
          <Text style={[styles.cajaTitulo, { color: "#ffff" }]}>
            Lista Productos:{" "}
          </Text>
          {carritoWithNoStock?.length == 0 && (
            <StyledText center bold style={{ marginTop: 20 }} title>
              No tiene productos agregados
            </StyledText>
          )}
          <FlatList
            data={carritoWithNoStock}
            renderItem={({ item, index }) => {
              return (
                <PedidoCard
                  pedido={item}
                  eliminar={eliminarProductoRefresh}
                  withbuttons={notNew ? false : true}
                  id={index}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return index;
            }}
          />
          {pedido && notNew === true ? (
            pedido?.textoFactura === "" && (
              <View style={styles.buttoncontainer}>
                <StyledButton
                  title="Reimprimir"
                  big
                  primary
                  style={{ width: 180 }}
                  onPress={() => {
                    connect();
                    console.log("PEDIDO", pedido);
                    console.log("PRODUCTOS", carritoWithNoStock);
                    console.log("CLIENTES", cliente);
                    imprimir();
                  }}
                />
              </View>
            )
          ) : (
            <View style={styles.cajaBotones}>
              <StyledButton
                title="Confirmar Pedido"
                big
                secondary
                style={{ width: 180 }}
                onPress={() => {
                  navigation.popToTop();
                  navigation.navigate("ClientesStack2");
                }}
              />
              {/* <StyledButton
                title="Cancelar Pedido"
                big
                secondary
                style={{ width: 180 }}
                onPress={() => {
                  setDeleteModal(true);
                }}
              />
              <StyledButton
                title="Guardar"
                big
                primary
                style={{ width: 180 }}
                onPress={() => {
                  if (carritoWithNoStock.length < 1) {
                    Alert.alert("No tiene productos agregados");
                    return;
                  }
                  setModalVisible(true);
                }}
              /> */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subcontainer: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  cajaResumen: {
    marginVertical: 10,
  },
  cajaCuerpo: {
    flex: 6,
    // backgroundColor: 'red',
    //alignItems: 'center',
    justifyContent: "center",
  },
  itemProducto: {
    borderWidth: 1,
    flexDirection: "row",
  },
  cajaBotones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  cajaFinal: {
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'cyan',
    marginBottom: 10,
    position: "relative",
  },
  cajaTitulo: {
    backgroundColor: theme.colors.modernaYellow,
    height: 30,
    justifyContent: "center",
    paddingLeft: 10,
    fontSize: 25,
  },
  resumen: {
    flexDirection: "row",
    paddingHorizontal: 30,
    justifyContent: "space-between",
    marginVertical: 1,
  },
  buttoncontainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});
