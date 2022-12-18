import { View, StyleSheet, Dimensions, ScrollView, Text, TouchableOpacity, Keyboard } from "react-native";
import StyledInput from "../../components/StyledInput";
import theme from "../../theme/theme";
import StyledText from "../../components/StyledText";
import { Button, Icon } from "@rneui/base";
import { useEffect, useRef, useState, useContext } from "react";
import { HelperText, Searchbar, TextInput } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import ClienteCabecera from "../../components/ClienteCabecera";
import {
  consultarProductos,
  consultarProductosLocalStorage,
  getProductoById,
} from "../../services/ProductoService";
import { addDetallePedido } from "../../services/CarritoService";
import { getStockById, getStockByIdProductoAzure } from "../../services/StockService";
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { getStockByIdProducto } from "../../services/StockService";
import { PedidoContext } from "../../context/PedidoContext";
import ModalModerna from "../../components/ModalModerna";
import { postAzure } from "../../services/backendServices/RestExecutor";
import ModernaContext from "../../context/ModernaContext/ModernaContext";

// export default function PedidoCliente({ navigation, route }) {
//   const cliente = route?.params?.cliente;
//   //const [idProductoSeleccionado, setIdProductoSeleccionado] = useState();
//   const [productoSeleccionado, setProductoSeleccionado] = useState(null);
// import { PedidoContext } from "../../context/PedidoContext";
// import ModalModerna from "../../components/ModalModerna";

export default function PedidoCliente({ navigation }) {
  const {
    cliente,
    setPedido,
    setCliente,
    agregarProductoAlCarrito,
    carrito,
    carritoWithNoStock,
    limpiarCarritos,
  } = useContext(PedidoContext);
  const {userSql} =useContext(ModernaContext)
  const [modal, setModal] = useState(false);
  const [idProductoSeleccionado, setIdProductoSeleccionado] = useState();
  const [productoSeleccionado, setProductoSeleccionado] = useState();
  const [stock, setStock] = useState(null);
  const [stockRestante, setStockRestante] = useState(0);
  const [productos, setProductos] = useState(null);

  // const [busqueda, setBusqueda] = useState();
  const [errorbusqueda, setErrorbusqueda] = useState("");
  const [error, setError] = useState(false);

  const [cantidadproducto, setCantidadProducto] = useState(0);
  const [errorCantidadProducto, setErrorCantidadProducto] = useState("");

  const [productoLista, setProductoLista] = useState();
  const [open, setOpen] = useState(false);
  //const [selectedItem, setSelectedItem] = useState(null);
  let hasErrors = false;
  const [a, setA] = useState()
  const [suggestionsList, setSuggestionsList] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const dropdownController = useRef(null)


  useEffect(() => {
    let lista = [];
    productos?.forEach((elemento) => {
      lista.push({ id: elemento.id_producto_sap, title: elemento.descripcion });
    });
    console.log(lista);
    //setProductoLista(lista);
    setSuggestionsList(lista)
  }, [productos]);



  const obtenerProductos = () => {
    consultarProductosLocalStorage("", setProductos);
  };

  useState(() => {
    obtenerProductos();
  }, []);

  const cargarInformacion = (e) => {
    getProductoById(e, setProductoSeleccionado);
  //  getStockByIdProducto(e, setStock);
  const succesFunction=async(data)=>{
    console.log("datos desde la pantalla pedidos",data)
    console.log("datos desde la pantalla pedidos userSql",userSql)
    setStock(data.data.dataBaseResult[0])
    /*for(let i=0;i<data.data.dataBaseResult.length;i++){
      if(data.data.dataBaseResult[i].id_vendedor==userSql){
        setStock(data.data.dataBaseResult[i])
        break;
      }else{
        setStock(null)
      }
      
    }*/
    

  }
  getStockByIdProductoAzure(e,succesFunction)

    if (!carrito || carrito.length === 0) {
      setStockRestante(0);
      return;
    }
    if (carrito.length > 0) {
      carrito.forEach((element) => {
        if (element?.producto?.idSap === e) {
          setStockRestante(element?.cantidad);
        }
      });
    }
  };

  const validate = () => {
    if (cantidadproducto == "" || cantidadproducto == null) {
      setError(true);
      hasErrors = true;
      setErrorCantidadProducto("Ingrese una cantidad");
    }

    if (productoSeleccionado == null || suggestionsList == null) {
      setErrorbusqueda("Escoja un producto");
      hasErrors = true;
    }
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  //const navigation = useNavigation();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  const eliminarCliente = () => {
    limpiarCarritos();
    setCliente(null);
    setPedido(null);
    navigation.navigate("ClientesStack2");
  };
  //-----------------------
  const agregar = () => {
    validate();
    if (hasErrors) {
      return;
    }
    agregarProductoAlCarrito(productoSeleccionado, cantidadproducto, stock);
    setIdProductoSeleccionado(null);
    setCantidadProducto(null);
    setStock(null);
    navigation?.navigate("PedidoResumen");
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.container2}> */}
      <ModalModerna
        visible={modal}
        setVisible={setModal}
        onSubmit={eliminarCliente}
        title={`¿Desea eliminar el cliente ${cliente?.nombre}?`}
      />
      <StyledText heading bold>
        PEDIDO
      </StyledText>
      <ClienteCabecera cliente={cliente} />
      {/* <DropDownPicker
        open={open}
        value={idProductoSeleccionado}
        items={productoLista}
        setOpen={setOpen}
        setValue={setIdProductoSeleccionado}
        setItems={setProductoLista}
        searchable={true}
        placeholder="Ingrese un producto"
        onChangeValue={(e) => {
          cargarInformacion(e);
        }}
        searchPlaceholder="Busque un producto"
        //style={{width:Dimensions.get("window").width - 80}}
        containerStyle={{
          width: Dimensions.get("window").width - 60,
          marginBottom: 10,
        }}
        // searchContainerStyle={{borderRadius:5}}
        searchTextInputStyle={{ width: 35 }}
        /> */}

      {/* __________________________________________________________________________________________________ */}
      <View
        style={{ zIndex: 1 }}
      >
        {/* https://github.com/onmotion/react-native-autocomplete-dropdown */}
        <AutocompleteDropdown
          // initialValue={{ id: "2" }}
          // clearOnFocus={false}
          //closeOnBlur={true}
          //closeOnSubmit={false}
          // suggestionsListMaxHeight={100}
          //direction={"down"}
          position="relative"
          onSelectItem={(e) => { cargarInformacion(e?.id) }}
          inputHeight={50}
          dataSet={suggestionsList}
          // onSubmit={cargarInformacion}
          // onChangeText={cargarInformacion}
          // RightIconComponent={<Icon name="search" type="font-awesome" size={20} color="black" />}

          emptyResultText={'No existe ese producto'}
          //ChevronIconComponent={<Icon name="search" type="font-awesome" size={20} color="black" />}
          // ClearIconComponent={<Icon name="search" type="feather" size={20} color="#fff" />}
          containerStyle={{ width: Dimensions.get("window").width - 58 }}
          textInputProps={{
            placeholder: 'Búsqueda',
            autoCorrect: false,
            autoCapitalize: 'none',
          }}
          rightButtonsContainerStyle={{
            right: 8,
            height: 30,
            // backgroundColor:'gray',
            alignSelf: 'center',

          }}
          inputContainerStyle={{
            backgroundColor: '#FFFFFF',
            borderRadius: 5,
            borderWidth: 1,
          }}
        />
      </View>

      {/* _________________________________________________________________________________________________ */}
      {/* 
        // ArrowDownIconComponent={({style}) => <Icon name="search" style={{paddingHorizontal:5}} />}
      /> */}
      <HelperText
        type="error"
        style={{ marginTop: -5, marginBottom: 5 }}
        visible={error}
      >
        {errorbusqueda}
      </HelperText>
      <ScrollView style={styles.inputGroup}>
        <View style={styles.inputlabels}>
          <StyledInput
            textColor
            noeditable
            label="Producto"
            value={productoSeleccionado?.descripcion}
            placeholder="Ingresa el producto"
            sty
            placeholderTextColor='red'
            style={styles.input}
          />

          <StyledInput
            bordBlack
            numeric
            label="Cantidad Producto"
            value={cantidadproducto}
            placeholder="Ingresa la cantidad"
            onChangeText={setCantidadProducto}
            style={styles.input}
            max_length={3}
            errorMessage={errorCantidadProducto}
          />

          <StyledInput
            noeditable
            textColor
            label="Cantidad Confirmada"
            value={
              productoSeleccionado
                ? stock
                  ? stock?.stock_actual + ""
                  : "Sin stock"
                : null
            }
            placeholder="Confirma la cantidad"
            style={styles.input}
          />

          <StyledInput
            noeditable
            textColor
            label="Precio Unitario"
            value={
              productoSeleccionado?.precio_venta &&
              "" + productoSeleccionado?.precio_venta
            }
            placeholder="Ingresa el precio"
            style={styles.input}
          />

          <StyledInput
            noeditable
            textColor
            placeholderColor
            label="Precio Total"
            value={
              productoSeleccionado && cantidadproducto
                ? "" + cantidadproducto * productoSeleccionado?.precio_venta
                : ""
            }
            placeholder="Total"
            style={styles.input}
          />
        </View>
      </ScrollView>
      <View style={styles.cajaBotones}>
        <Button
          title=" Eliminar Cliente "
          buttonStyle={{
            borderRadius: 5,
            marginHorizontal: 10,
            backgroundColor: theme.colors.modernaRed,
          }}
          size="lg"
          onPress={() => setModal(true)}
        />

        <Button
          title=" Agregar Carrito "
          onPress={agregar}
          buttonStyle={{
            borderRadius: 5,
            marginHorizontal: 10,
            backgroundColor: theme.colors.modernaYellow,
          }}

          size="lg"
        />

      </View>
      <View style={
        isKeyboardVisible ? styles.hide : styles.estiloCarrito
      }>
        {/* size="lg"
        />
      </View>
      <View
        style={{
          backgroundColor: theme.colors.modernaRed,
          alignItems: "center",
          justifyContent: "center",
          height: 65,
          width: 950,
        }}
      > */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PedidoResumen");
          }}
        >
          <Icon name="shoppingcart" type="antdesign" size={40} color="white" />
        </TouchableOpacity>
      </View>
      {/* </View> */}
      {/* //aqui */}
    </View >
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    width: Dimensions.get("window").width,
  },
  inputlabels: {
    marginHorizontal: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: 'center',
    justifyContent: 'center',
    //paddingHorizontal:5
    //alignItems: "center",
  },
  estiloCarrito: {
    backgroundColor: theme.colors.modernaRed,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    width: 950,
    // position:'relative'
  },
  hide: {
    display: "none",
  },
  container2: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: 'center',
    alignItems: "center",
  },
  inputGroup: {
    width: Dimensions.get('window').width ,
  },
  cajaCabecera: {
    //flex: 2,
    // backgroundColor: 'cyan',
    //alignItems: "center",
    //justifyContent: "flex-end",
    //paddingBottom: 15,
  },
  txtinput: {
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: "gray",
    width: 270,
    height: 60,
    textAlign: "center",
  },
  botonStyle: {
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cajaBotones: {
    //backgroundColor:'black',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    // paddingTop: 25,
    marginBottom: 10
  },
  input: {
    maxHeight: 80,
    //width: Dimensions.get("window").width - 80,
    // marginVertical: 3,
    tintColor: "#A3A3A3",
  },
});
