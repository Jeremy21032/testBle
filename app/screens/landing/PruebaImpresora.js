import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Button, Icon } from "@rneui/base";
import Header from "../../components/Header";
import StyledText from "../../components/StyledText";
import theme from "../../theme/theme";
import {
  printer1,
  ConectarImpresora,
  VerificarBlu,
} from "../../services/ImpresoraService";
import NetInfo from "@react-native-community/netinfo";
import { NavigationContext } from "../../context/NavigationProvider";
import ModernaContext from "../../context/ModernaContext/ModernaContext";
import { Divider } from "react-native-paper";
import { requestPermissions } from "../../commons/sqlite_config";

export const PruebaImpresora = () => {
  // const [status, setstatus] = useState();
  const {
    handlePrinterAddress,
    handlePrinterAddressDefault,
    printerAddressDefault,
    printerAddress,
  } = useContext(ModernaContext);
  const [mensajeImpresora, setmensajeimpresora] = useState();
  const [internet, setInternet] = useState();
  const { statusImpresora, setStatusImpresora } = useContext(NavigationContext);
  const [impresoras, setimpresoras] = useState([]);
  const conexionState = () => {
    NetInfo.fetch().then((state) => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setInternet(state.isConnected);
      setTimeout(conexionState, 2000);
    });
  };

  useEffect(() => {
    try {
      console.log(
        "desde la funcion-------------------------------------------------" +
          printerAddressDefault
      );
      console.log("desde el contexto" + printerAddress);
      if (printerAddress) {
        setprinter(printerAddress);
      } else {
        setprinter(printerAddressDefault);
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
      console.error("no funciona", error);
    }
  }, [printerAddress, printerAddressDefault]);

  let ItemImpresora = ({ title, content }) => (
    <ScrollView>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          handlePrinterAddress(title);
        }}
      >
        <View>
          <StyledText>{statusImpresora ? title : ""}</StyledText>
          <StyledText>{statusImpresora ? content : ""}</StyledText>
          <Divider bold="true" />
        </View>
      </TouchableHighlight>
    </ScrollView>
  );

  const imprimir = () => {
    printer1(ENCABEZADO, printer);
  };

  useEffect(() => {
    requestPermissions();
    connect();
    checkBlutu();
    conexionState();

    //console.log("hola");
    // Conexionimpresora(printer)
  }, []);

  const [printer, setprinter] = useState();

  //fUNCION Reciproca, Listener ultra ULTRA PRO
  const checkBlutu = () => {
    VerificarBlu(setStatusImpresora);
    // console.log("cambiando")
    //connect();
    setTimeout(checkBlutu, 2000);
  };

  async function connect() {
    await ConectarImpresora(handlePrinterAddressDefault, setimpresoras);
    console.log(mensajeImpresora);
    console.log("Impresoras desde la pantalla conexiones", impresoras);
  }

  //solo tengo q contatenar los text con los codigos de la impresora para la parte de productos, tranqui
  var prueba2 = "^FD ESTO ES UNA PRUEBA";
  var prueba = "^FDMODERNA ALIMENTOS";
  var ENCABEZADO =
    "^XA  ^FS^CI28^FO20,80^ASN^ADN,25,10^FDDirección:SAN GABRIEL OE7-89 Y VALDERRAMA ^XZ";

  const renderItem = ({ item }) => (
    <ItemImpresora title={item.address} content={item.name} />
  );

  return (
    <View style={styles.container}>
      <Header />

      <StyledText bold heading center>
        Conexiones
      </StyledText>
      <View style={{ flexDirection: "row" }}>
        <StyledText>Impresora</StyledText>
        {/* <TouchableHighlight onPress={connect}  style={{marginHorizontal:10,marginBottom:23}}>
                    <Icon
                      
                        name='reload1'
                        type='ant-design'
                        
                       
                    />
                </TouchableHighlight> */}

        {/* <Button
                    title='Verificar'
                    onPress={connect}
                    buttonStyle={{ backgroundColor: theme.colors.modernaRed, width: 50 }}
                    containerStyle={{ alignItems: 'center', paddingTop: 15 }}
                /> */}
      </View>
      <View
        style={{
          backgroundColor: "#F0F0F0",
          height: 100,
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
      >
        <View
          style={{
            /*backgroundColor: 'cyan',*/ flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            type="feather"
            name={statusImpresora ? "check-circle" : "x-circle"}
            //color={status ? "green" : "gray"}
            color={
              statusImpresora
                ? theme.colors.modernaGreen
                : theme.colors.modernaRed
            }
          />
          <StyledText
            style={{
              paddingLeft: 5,
              color: statusImpresora ? "black" : theme.colors.modernaRed,
            }}
          >
            {statusImpresora
              ? "¡Este dispositivo tiene Bluetooth!"
              : "Sin conexión a Bluetooth"}
          </StyledText>
        </View>

        <View
          style={{
            /*backgroundColor: 'gray',*/ flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            name={statusImpresora ? "check-circle" : "x-circle"}
            type="feather"
            color={
              statusImpresora
                ? theme.colors.modernaGreen
                : theme.colors.modernaRed
            }
          />
          <StyledText
            style={{
              paddingLeft: 5,
              color: statusImpresora ? "black" : theme.colors.modernaRed,
            }}
          >
            {statusImpresora
              ? "¡Bluetooth  habilitado!"
              : "¡Bluetooth  inhabilitado!"}
          </StyledText>
        </View>
      </View>
      {/* ------------------------------ */}
      {statusImpresora ? (
        <>
          <View
            style={{
              backgroundColor: "#F0F0F0",
              height: 100,
              justifyContent: "center",
              paddingHorizontal: 15,
              marginTop: 15,
            }}
          >
            <StyledText style={{ marginBottom: 10 }}>
              Dispositivo predeterminado
            </StyledText>

            <FlatList
              data={impresoras}
              renderItem={renderItem}
              keyExtractor={(item) => item.address}
            />
          </View>

          <Button
            title="Pagina de prueba"
            onPress={imprimir}
            buttonStyle={{
              backgroundColor: theme.colors.modernaRed,
              width: 150,
            }}
            containerStyle={{ alignItems: "center", paddingTop: 15 }}
          />
        </>
      ) : (
        <></>
      )}
      <StyledText subtitle style={{ marginVertical: 10 }}>
        Conexión a internet:{" "}
      </StyledText>
      <View
        style={{
          backgroundColor: "#F0F0F0",
          height: 50,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
          }}
        >
          <Icon
            name="check-circle"
            type="feather"
            color={
              internet ? theme.colors.modernaGreen : theme.colors.modernaRed
            }
          />
          <StyledText
            style={{
              paddingLeft: 5,
              color: internet ? "black" : theme.colors.modernaRed,
            }}
          >
            {internet ? "¡Ya estas conectado!" : "Sin conexion"}
          </StyledText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
});
