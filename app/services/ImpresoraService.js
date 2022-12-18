
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';
export const ConectarImpresora = async (setPrinter,setImpresoras) => {
    //let impresoras=[{address:"AC:4545:345435",name:"impresora quemdas"}]

    const dispositivos = await RNZebraBluetoothPrinter.pairedDevices();

    // console.log("Disp:",dispositivos)
    const impresora = await dispositivos.filter((device) => device.class === 1664 || device.name.substring(0,2)=="XX");
    //console.log(impresora)
    
    const p = impresora.length ? impresora[0] : null;


    if (p === null) {
        let impresoraVacia = {
            name: "--------",
            address: "-------"
        }
        //console.warn("No se puedo encontrar una impresora en su bluttoth:", dispositivos);
        // Alert.alert("No se puedo encontrar una impresora en su bluttoth:", dispositivos)
        setPrinter(impresoraVacia);
        // Alert.alert("unable to find printer. Found devices:", dispositivos)
    } else {
        setPrinter(p.address);
        //impresoras.push(p);

    }
    // impresora.push({address:"AC:4545:345435",name:"impresora quemadas"})    
    if(setImpresoras){
        setImpresoras(impresora)
    }
   
    console.log("Lista de Impresoras:",dispositivos)
    console.log("Una Impresora",p)
}


export const printer1 = async (zpl, printer) => {

    console.log("printer addres:", printer)
    await RNZebraBluetoothPrinter.print(
        printer,
        zpl).then((res) => {
            console.log(res)
        }).catch(error => console.log(error.message));
}

export const VerificarBlu = async (setStatus) => {
    RNZebraBluetoothPrinter.isEnabledBluetooth().then((res) => {
        setStatus(res)
        // console.log("Status Bl: ",res)
    })
}

export const VerficarConexionimpresora = async (direccioniP) => {

    await RNZebraBluetoothPrinter.connectDevice(direccioniP.address).then((res) => {
        console.log("RespuestaconexionImpresora:", res)
    })
}