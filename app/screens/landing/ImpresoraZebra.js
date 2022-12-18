import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext } from 'react';
import { Alert, Button, StyleSheet, Text, View, TextInput, SafeAreaView } from 'react-native';
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
import { ConectarImpresora } from '../../services/ImpresoraService';
import { printer1 } from '../../services/ImpresoraService';

export default function Impre() {
    // const {datosImpresora} = useContext(SessionContext);
    const [palalbe, setPalabra] = useState("")
    const [Ruc, setRuc] = useState("")
    const [Telefono, setTelefono] = useState("")
    const [printer, setprinter] = useState();
    useEffect(() => {
        //setprinter(datosImpresora);
        async function connect() {
            await ConectarImpresora(setprinter);
        }
        connect();
        // console.log("recibo:", ConectarImpresora())
        // console.log("recibocon Pse de funcion:", info)

    }, []);





    var text = palalbe;
    var ruc = Ruc;
    var tele = Telefono;
    console.log(typeof (text))

    //solo tengo q contatenar los text con los codigos de la impresora para la parte de productos, tranqui
    var prueba = "^FD2MODERNA ALIMENTOS"
    var ENCABEZADO = "^XA^FX Top section with logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^FO75,75^R^GB100,100,100^FS^FO93,93^GB40,40,40^FS^FO220,50" + prueba + "^FS^CF0,30^FO220,115^FDNombre:" + text + "^FS^FO220,155^FDRuc:" + ruc + "^FS^FO220,195^FDTelefono:" + tele + "^FS^FO50,250^GB700,3,3^FS^FX Second section with recipient address and permit information.^CFA,30^FO50,300^FDSe supone que aqui van los productos!!!!^FS^FO50,340^Producto1^FS^FO50,380^FDProducto2^FS^FO50,420^FDProducto3^FS^CFA,15^FO600,300^GB150,150,3^FS^FO638,340^FDPermit^FS^FO638,390^FD123456^FS^FO50,500^GB700,3,3^FS^FX Third section with bar code.^BY5,2,270^FO100,550^BC^FD12345678^FS^FX Fourth section (the two boxes on the bottom).^FO50,900^GB700,250,3^FS^FO400,900^GB3,250,3^FS^CF0,40^FO100,960^FDCtr. X34B-1^FS^FO100,1010^FDREF1 F00B47^FS^FO100,1060^FDREF2 BL4H8^FS^CF0,190^FO470,955^FDCA^FS^XZ";
    // var NOMBRE = "^XA" + "^FO50,50" + "^A0N10,10" + "^FDNombre:" + text + "^FS" + "^XZ";
    // const ConectarImpresora = async () => {


    //     const dispositivos = await RNZebraBluetoothPrinter.pairedDevices();
    //     const impresora = dispositivos.filter((device) => device.class === 1664);
    //     //console.log(impresora)
    //     const p = impresora.length ? impresora[0] : null;
    //     if (p === null) {
    //         console.warn("unable to find printer. Found devices:", dispositivos);
    //     }
    //     console.log(p)
    //     setprinter(p);

    // }

     
    const imprimir=()=>{
        printer1(ENCABEZADO,printer)

    }



    // const printer1 = async () => {

    //     console.log(palalbe)
    //     console.log("printer addres:", printer.address)
    //     await RNZebraBluetoothPrinter.print(
    //         printer.address,
    //         ENCABEZADO).then((res) => {
    //             console.log(res)
    //         }).catch(error => console.log(error.message));
    // }






    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>

            <Button
                title='Verificar'
                onPress={imprimir}
            />


            <TextInput
                style={styles.input}
                onChangeText={setPalabra}
                value={palalbe}
                placeholder="useless placeholder"

            />
            <TextInput
                style={styles.input}
                onChangeText={setRuc}
                value={Ruc}
                placeholder="Ruc"

            />
            <TextInput
                style={styles.input}
                onChangeText={setTelefono}
                value={Telefono}
                placeholder="Ruc"

            />


            <StatusBar style="auto" />
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});
