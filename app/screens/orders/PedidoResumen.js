import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
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
import ModernaContext from "../../context/ModernaContext/ModernaContext";
import { postAzure } from "../../services/backendServices/RestExecutor";
const SALTO = 15
const SALTO2 = 25

export default function PedidoResumen({ route, navigation }) {
  const notNew = route?.params?.notNew;
  const [impresoras, setimpresoras] = useState([]);

  const [factura, setFactura] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const {
    //info sub,total,iva
    pedido,
    setPedido,
    //productos
    carrito,
    setCarrito,
    limpiarCarritos,
    //datos cliente
    id_vendedor,
    cliente,
    azure_user,
    setCliente,
    carritoWithNoStock,
    removerProductoDelCarrito,
  } = useContext(PedidoContext);

  const { printerAddress, printerAddressDefault } = useContext(ModernaContext)

  const idPedido = notNew ? pedido?.idPedido : generateUIDD();

  const [printer, setprinter] = useState();

  // const verCarrito = () => {
  //   pedido?.detallePedido?.array.forEach(element => {
  //     console.log(element.Nombre);
  //   });
  // }

  //zpl

  const imprimir = () => {
    let disty = 340;

    const productos = []
    console.log("CARRITO", carrito)
    carrito.forEach(element => {
      disty = disty + SALTO + 4
      let producto = "^FS^CI28^FO50," + disty + "^ASN^ADN,25,10^FDHarina ^FS^FO300," + disty + "^ADN,25,10^FD" + element.cantidad + "^FS^FO440," + disty + "^ADN,25,10^FD" + element.precioUnitario + "^FX";
      console.log("desde el array", producto)

      productos.push(producto)
    });
    var Produtosfinal = "" + productos.toString()
    Produtosfinal = Produtosfinal.replace(" ", "");
    console.log("Fuera del array, lista de productos", Produtosfinal)



    // var iva=factura.iva
    // var ENCABEZADO2 = "^XA^FX Top section with logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^FO75,75^R^GB100,100,100^FS^FO93,93^GB40,40,40^FS^FO220,50" + prueba + "^FS^CF0,30^FO220,115^FDNombre:" + text + "^FS^FO220,155^FDRuc:" + ruc + "^FS^FO220,195^FDTelefono:" + tele + "^FS^FO50,250^GB700,3,3^FS^FX Second section with recipient address and permit information.^CFA,30^FO50,300^FDSe supone que aqui van los productos!!!!^FS^FO50,340^Producto1^FS^FO50,380^FDProducto2^FS^FO50,420^FDProducto3^FS^CFA,15^FO600,300^GB150,150,3^FS^FO638,340^FDPermit^FS^FO638,390^FD123456^FS^FO50,500^GB700,3,3^FS^FX Third section with bar code.^BY5,2,270^FO100,550^BC^FD12345678^FS^FX Fourth section (the two boxes on the bottom).^FO50,900^GB700,250,3^FS^FO400,900^GB3,250,3^FS^CF0,40^FO100,960^FDCtr. X34B-1^FS^FO100,1010^FDREF1 F00B47^FS^FO100,1060^FDREF2 BL4H8^FS^CF0,190^FO470,955^FDCA^FS^XZ";

    var iva = notNew ? pedido.iva : factura.iva;
    var subtotal = notNew ? pedido.subtotal : factura.subtotal
    var total = notNew ? pedido.total : to2Decimals(factura.subtotal+factura.iva)

    var Direccion = "^FS^CI28^FO20,80^ASN^ADN,25,10^FDDirección:SAN GABRIEL OE7-89 Y VALDERRAMA";
    var Telefono = "^FS^CI28^FO20,100^ASN^ADN,25,10^FDTeléfono:(02) 2985100";
    var Ruc = "^FS^FO20,120^ADN,25,10^FDRuc: 1790049795001";
    var TipoPedido = "^FS^FO100,140^ADN,25,10^FDTipo de Pedido:";
    var linea = "^FS^FO10,160^GB500,1,4";
    var Nombre = "^FS^FO20,180^ADN,25,10^FDNombre:" + cliente.nombre;
    var RUCcED = "^FS^CI28^FO20,200^ASN^ADN,25,10^FDRuc o Cédula:" + cliente.identificacion;
    var dIRECI = "^FS^CI28^FO20,220^ASN^ADN,25,10^FDDirección:" + cliente.direccion;
    var telegono = "^FS^CI28^FO20,240^ASN^ADN,25,10^FDTeléfono:" + cliente.telefono;
    var Vendedor = "^FS^FO20,260^ADN,25,10^FDVendedor:";
    var Fecha = "^FS^FO20,280^ADN,25,10^FDFecha:" + getActualDate();
    var CodPedido = "^FS^CI28^FO100,300^ASN^ADN,25,10^FDNúmero de Pedido:" + idPedido;


    var linea3 = "^FS^FO10,320^GB500,1,4";
    var EnunciadosProductos = "^FS^CI28^FO50,340^ASN^ADN,25,10^FDDescripción ^FS^FO260,340^ADN,25,10^FDCantidad   ^FS^FO400,340^ADN,25,10^FDPrecio" + Produtosfinal;
    // var ZonaProductos = ""+Produtosfinal;
    disty = disty + SALTO2
    var iva = "^FS^FO30," + disty + "^ADN,25,10^FDIVA:" + iva;
    disty = disty + SALTO2
    var Subtotal = "^FS^FO30," + disty + "^ADN,25,10^FDSubtotal:" + subtotal + "^FS^FO300," + disty + "^ADN,25,10^FDTotal:" + total;
    disty = disty + SALTO2 + 50
    var linea2 = "^FS^FO40," + disty + "^GB400,1,4";
    disty = disty + (SALTO2 - 4)
    var FirmaVendedor = "^FS^FO140," + disty + "^ADN,25,10^FDFirma Vendedor";
    disty = disty + SALTO2 + 50
    var linea4 = "^FS^FO40," + disty + "^GB400,1,4";
    disty = disty + (SALTO2 - 4)
    var FirmaCliente = "^FS^FO140," + disty + "^ADN,25,10^FDFirma Cliente";
    disty = disty + SALTO2

    var linea5 = "^FS^FO5," + disty + "^GB600,1,4";
    disty = disty + SALTO2
    var MensajeFinal1 = "^FS^FO1," + disty + "^ADN,0.2,0.8^FD*Este documento no constituye";
    disty = disty + SALTO2

    var Mensaje2 = "^FS^FO1," + disty + "^ADN,0.2,0.8^FDvalor tributario."
    var MensajeFinal = MensajeFinal1 + Mensaje2








    var ENCABEZADO =
      "^XA  ^FO150,00^ADN,50,10^FDMODERNA ALIMENTOS S.A.   " +
      Direccion +
      Telefono +
      Ruc +

      linea +
      Nombre +
      RUCcED +
      dIRECI +
      telegono +
      Vendedor +
      Fecha +
      CodPedido + linea3 +
      EnunciadosProductos +
      iva +
      Subtotal +
      FirmaVendedor +
      linea2 +
      linea4 +
      FirmaCliente +
      linea5 +
      MensajeFinal +
      " ^FDCA^FS    ^XZ ";

    // var ENCABEZADO=  "^XA^FX" + //-- EMPRESA - ALMACEN
    // "^CI28" +
    // "^FO55,28^ASN^A0R,25,45^FDCompañerÓs || de 4°^FA200^FS" +
    // "^FO20,28^A0R,25,45^FN2^FA200^FS^XZ"




    // var ENCABEZADO="^XA^LL0406^CI28^CWZ,E:TT0003M_.FNT^PA0,1,1,0^FO609,50,2^AZN,40,35^TBN,559,300^FH^FDdfgdfg <-- new line gdgdfgdfgdfgdg <-- new linedfgdfgdf  ^FS^PQ1^XZ"
    console.log()
    printer1(ENCABEZADO, printer);
  };

  // async function connect() {
  //   await ConectarImpresora(setprinter);
  // }

  useEffect(() => {
    if (pedido && notNew === false) {
      findClientById(pedido?.idCliente, setCliente);
      consultarDetallePedido(pedido?.idPedido, setCarrito);
    }
    // connect();
  }, [pedido]);

  useEffect(() => {
    if (carrito) {
      setFactura(
        notNew === true
          ? { iva: pedido?.iva, subtotal: pedido?.subtotal }
          : calcularFacturaPedido(carrito)
      );
    }
    // connect();
  }, [carrito]);



  useEffect(() => {
    if (pedido) {
      return;
    }

    // console.log("Carrito:", c1)
    // async function connect() {
    //   await ConectarImpresora(setprinter);
    // }
    // connect();


  }, []);

  useEffect(() => {

    try {
      console.log("desde la funcion-------------------------------------------------" + printerAddressDefault)
      console.log("desde el contexto" + printerAddress)
      if (printerAddress) {
        setprinter(printerAddress)
      } else {
        setprinter(printerAddressDefault)
      }
      //if (printerAddressDefault) {

      /* if (printerAddressDefault==printerAddress ) {
         console.log("seleciona el que cogio el default--------------------")
         setprinter(printerAddress)
       } else {
         console.log("selecciona el que cogio del touch-----------")
         setprinter(printerAddressDefault)
       }
*/


      // }

    } catch (error) {

      console.error("no funciona", error)

    }




  }, [printerAddress, printerAddressDefault]);




  const eliminarProductoRefresh = (id) => {
    removerProductoDelCarrito(id);
  };
  const cancelarPedido = () => {
    setCarrito([]);
    setCliente(null);
    setPedido(null);
    navigation.navigate("ClientesStack2");
  };

  const guardarPedidoYCliente = () => {

    try {

      const idCliente = registerClient(
        cliente?.nombre,
        cliente?.identificacion,
        cliente?.direccion,
        cliente?.telefono,
        false
      );
      if (carrito?.length > 0) {
        postAzure("https://modernafunctions.azurewebsites.net/api/functionOrder?code=SgUfoBAcyYNmrFVLAaaUBPTlur6b8K3rFJLiMQ2GZieMAzFuFa_Kmw==",
          {
            "typeQuery": "I",
            "data": {
              "fieldType": [
                "id_cliente",
                "id_vendedor",
                "subtotal",
                "iva",
                "total",
                "texto_factura",
                "codigo_sap",
                "usuario_creacion",
                "usuario_modificacion"
              ],
              "fieldData": [
                1,
                2,
                to2Decimals(factura?.subtotal),
                true,
                to2Decimals(factura?.total),
                "",
                null,
                cliente?.nombre,
                azure_user?.givenName
              ]
            }
          }, () => {
            db_insertPedido(
              generateUIDD(),
              1,
              idCliente,
              getActualDate(),
              factura?.subtotal,
              factura?.iva,
              factura?.subtotal + factura?.iva,
              "",
              true,
              carrito
            );
          }, (e) => {
            console.error(e)
            db_insertPedido(
              generateUIDD(),
              1,
              idCliente,
              getActualDate(),
              factura?.subtotal,
              factura?.iva,
              factura?.subtotal + factura?.iva,
              "",
              false,
              carrito
            );
          })


        imprimir();
        imprimir();

      }
      if (carritoWithNoStock?.length > 0) {
        navigation.navigate("PedidoResumen2")
      } else {
        limpiarCarritos()
        setPedido({});
        setCliente({});
        navigation.popToTop();
        navigation.navigate("ClientesStack2");
      }

    } catch {
      console.log("algo no ha ido bien");
    }
    // navigation.navigate("ClientesStack2");
    //   if (carrito.length > 0) {
    //     db_insertPedido(
    //       generateUIDD(),
    //       1,
    //       idCliente,
    //       getActualDate(),
    //       factura?.subtotal,
    //       factura?.iva,
    //       factura?.subtotal + factura?.iva,
    //       "",
    //       false,
    //       carrito
    //     );
    //   }
    //   if (carritoWithNostock?.length > 0) {
    //     const factura2 = calcularFacturaPedido(carritoWithNoStock);
    //     db_insertPedido(
    //       generateUIDD(),
    //       1,
    //       idCliente,
    //       getActualDate(),
    //       factura2?.subtotal,
    //       factura2?.iva,
    //       factura2?.subtotal + factura2?.iva,
    //       "Pedido sin stock",
    //       false,
    //       carritoWithNoStock
    //     );
    //   }
    //   if (carritoWithNostock?.length > 0) {
    //     navigation.navigate("PedidoResumenSinStock");
    //   } else {
    //     limpiarCarritos();
    //   }
    // } catch {
    //   console.log("algo no ha ido bien");
  }
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
        visible={false}
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
          {`Fecha emisión: ${notNew === true ? pedido?.fecha : getActualDate()
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
              <View>
                <StyledText
                  style={{ marginTop: 5 }}
                  center
                  bold
                  modernaPrimary
                >
                  Uno de los productos no tiene stock suficiente
                </StyledText>
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate("PedidoSinStock")}
                  ></TouchableOpacity> */}
              </View>
            )}
          <View style={{ marginTop: -10 }}>
            <ClienteCabecera cliente={cliente} />
          </View>
        </View>
        <View style={styles.cajaCuerpo}>
          <StyledText heading modernaPrimary bold>
            $ {to2Decimals(factura?.subtotal + factura?.iva)}
          </StyledText>
          <View style={{height:50,justifyContent:'center'}}>
          <Text style={[styles.cajaTitulo, { color: "#ffff"}]}>Resumen: </Text>
          </View>
          
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
          {carrito?.length == 0 && (
            <StyledText center bold style={{ marginTop: 20 }} title>
              No tiene productos agregados
            </StyledText>
          )}
          <FlatList
            data={carrito}
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
                    // connect();
                    console.log("PEDIDO", pedido)
                    console.log("PRODUCTOS", carrito)
                    console.log("CLIENTES", cliente)
                    imprimir();
                  }}
                />
              </View>
            )
          ) : (
            <View style={styles.cajaBotones}>
              <StyledButton
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
                  if (carrito.length < 1 && carritoWithNoStock?.length < 1) {
                    Alert.alert("No tiene productos agregados");
                    return;
                  }
                  setModalVisible(true);
                }}
              />
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
    justifyContent: "space-between",
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

