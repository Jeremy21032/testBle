import React, { useContext, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import { Alert } from "react-native";
import { View, StyleSheet, Modal } from "react-native";
import StyledButton from "../../components/StyledButton";
import StyledInput from "../../components/StyledInput";
import StyledText from "../../components/StyledText";
import { es_EC as errors } from "../../commons/texts";
import Icons from "../../components/Icons";
import { PedidoContext } from "../../context/PedidoContext";
import { validateCedula } from "../../commons/validations";

export default function RegistroCliente({ navigation }) {
  const screenWidth = Dimensions.get("window").width;
  const { setCliente, setCarrito } = useContext(PedidoContext);

  const [identificacion, setIdentificacion] = useState("1314719608");
  const [errorCedula, setErrorCedula] = useState("");
  const [nombre, setNombre] = useState("Cristhian Castro");
  const [errorNombre, setErrorNombre] = useState("");
  const [direccion, setDireccion] = useState("Av 10 de Agosto");
  const [errorDireccion, setErrorDireccion] = useState("");
  const [telefono, setTelefono] = useState("0912345678");
  const [errorTelefono, setErrorTelefono] = useState("");

  const validate = () => {
    if (!identificacion || identificacion === "") {
      setErrorCedula(errors.CI_EMPTY);
      return true;
    }
    if (identificacion.length !== 10 && identificacion.length !== 13) {
      setErrorCedula(
        identificacion.length < 10
          ? errors.CI_LESS_THAN_TEN
          : errors.CI_RUC_INVALID_LENGTH
      );
      return true;
    }
    const digits = parseInt(identificacion.slice(0, 2));
    if (digits > 24) {
      setErrorCedula(errors.CI_FIRST_2_DIGITS_GR_24);
      return true;
    }
    if (!validateCedula(identificacion)) {
      setErrorCedula("Identificación no válida");
      return true;
    }
    if (!nombre || nombre === "") {
      setErrorNombre(errors.EMPTY_NAME);
      return true;
    }
    // let wordsCount = nombre.split(" ").length;
    // if (nombre.endsWith(" ")) {
    //   wordsCount -= 1;
    // }
    // if (wordsCount < 2) {
    //   setErrorNombre(errors.AT_LEAT_1_NAME_LASTNAME);
    //   return true;
    // }
    if (nombre.length > 40) {
      setErrorNombre(errors.MAX_LENGTH_40);
      return true;
    }
    if (!direccion || direccion === "") {
      setErrorDireccion(errors.EMPTY_ADDRESS);
      return true;
    }
    if (direccion.length > 80) {
      setErrorDireccion(errors.MAX_LENGTH_80);
      return true;
    }
    if (!telefono || telefono === "") {
      setErrorTelefono(errors.EMPTY_PHONE);
      return true;
    }
    if (telefono.length > 10) {
      setErrorTelefono(errors.MAX_LENGTH_10);
      return true;
    }
    if (telefono.length < 9) {
      setErrorTelefono(errors.MIN_LENGTH_9);
      return true;
    }
    const telfdigits = telefono.slice(0, 2);
    if (telefono.length === 10 && telfdigits !== "09") {
      setErrorTelefono(errors.STARTS_WITH_09);
      return true;
    }
    if (telefono.length === 9 && false) {
      setErrorTelefono(errors.STARTS_WITH_PROVINCE_CODE);
      return true;
    }
    return false;
  };
  const cancelar = () => {
    Alert.alert("Usuario eliminado");
    setCliente(null);
    navigation.goBack();
  };
  const register = () => {
    if (validate()) {
      return;
    }
    const cliente = {
      nombre: nombre.toUpperCase(),
      identificacion: identificacion.toUpperCase(),
      direccion: direccion.toUpperCase(),
      telefono: telefono,
      sincronizado: false,
    };
    setCarrito([]);
    setCliente(cliente);
    Alert.alert("Registrado", "El usuario " + nombre + " ha sido ingresado");
    navigation.navigate("AgregarPedido");
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.title}>
        <StyledText heading center bold style={{ marginBottom: 50 }}>
          REGISTRO CLIENTE
        </StyledText>
      </View>
      <View style={styles.inputgroup}>
        <StyledInput
          max_length={13}
          numeric
          label="Cédula o RUC"
          placeholder="Ingrese la cédula o RUC"
          value={identificacion}
          onChangeText={(e) => {
            setIdentificacion(e);
            setErrorCedula("");
          }}
          errorMessage={errorCedula}
          icon={<Icons password />}
        />
        <StyledInput
          mayus
          max_length={40}
          label="Apellidos y Nombres"
          placeholder="Ingrese los apellidos y nombres"
          value={nombre}
          onChangeText={(e) => {
            setNombre(e);
            setErrorNombre("");
          }}
          errorMessage={errorNombre}
        />
        <StyledInput
          mayus
          max_length={80}
          label="Dirección"
          placeholder="Ingrese la dirección"
          value={direccion}
          onChangeText={(e) => {
            setDireccion(e);
            setErrorDireccion("");
          }}
          errorMessage={errorDireccion}
        />
        <StyledInput
          max_length={10}
          numeric
          label="Teléfono"
          placeholder="Ingrese número de teléfono"
          value={telefono}
          onChangeText={(e) => {
            setTelefono(e);
            setErrorTelefono("");
          }}
          errorMessage={errorTelefono}
        />
      </View>
      <View style={styles.buttongroup}>
        <StyledButton
          title="Eliminar cliente"
          onPress={cancelar}
          style={{ width: screenWidth / 2.7 }}
          secondary
          big
        />
        <StyledButton
          title="Guardar"
          style={{ width: screenWidth / 2.7 }}
          onPress={register}
          primary
          big
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 2,
  },
  title: {
    marginTop: 10,
  },
  inputgroup: {
    paddingHorizontal: 10,
    justifyContent: "center",
    marginVertical: 30,
  },
  buttongroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
