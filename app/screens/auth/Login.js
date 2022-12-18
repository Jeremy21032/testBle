import React, { useContext, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import theme from "../../theme/theme";
import { Button } from "@rneui/base";
import StyledText from "../../components/StyledText";
import StyledInput from "../../components/StyledInput";
import Icons from "../../components/Icons";
import Header from "../../components/Header";
import { validateEmail } from "../../commons/validations";
import { SessionContext } from "../../context/SessionProvider";
import StyledButton from "../../components/StyledButton";
import { authorize } from "react-native-app-auth";
import { AD_config } from "../../commons/config_azure";
import ModernaContext from "../../context/ModernaContext/ModernaContext";
const config = {
  warmAndPrefetchChrome: true,
  issuer: AD_config.ISSUER,
  clientId: AD_config.CLIENTE_ID,
  redirectUrl: AD_config.ANDROID_REDIRECT_URI,
  scopes: AD_config.SCOPE_ARRAY,
};
export default function Login({ navigation }) {
  const {handleLoginAzure} = useContext(ModernaContext);
  const [correo, setCorreo] = useState();
  const [password, setPassword] = useState();
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [errorCorreo, setErrorCorreo] = useState();
  const [errorPassword, setErrorPassword] = useState();
  const { sessionUser, setSessionUser } = useContext(SessionContext);

  let hasErrors = false;
  const personaIngreso = () => {
    /*setErrorCorreo(null);
    setErrorPassword(null);
    hasErrors = false;
    validate();
    if (hasErrors) {
      return;
    }
    setSessionUser(correo);
    navigation.navigate("DescargarDiario");*/
    login();
  };

  if (sessionUser) {
   // navigation.navigate("DescargarDiario");
  }

  const validate = () => {
    if (correo == null || correo == "") {
      setErrorCorreo("Debe ingresar su correo");
      hasErrors = true;
    } else if (!validateEmail(correo)) {
      setErrorCorreo("Debe ingresar un correo valido");
      hasErrors = true;
    }

    if (password == null || password == "") {
      setErrorPassword("Debe ingresar su contraseña");
      hasErrors = true;
    }
  };
  const login = async () => {
    try {
      handleLoginAzure();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Header
        scale={1.1}
        style={{ paddingTop: Dimensions.get("window").height / 10 }}
      />
      <StyledText style={styles.title} center bold subtitle>
        Ingresa con tu correo o contraseña
      </StyledText>
      <View style={styles.cajaCuerpo}>
        <StyledInput
          style={{ marginBottom: 35 }}
          email
          lowercase
          placeholder="Correo"
          label="Correo"
          errorMessage={errorCorreo}
          value={correo}
          onChangeText={(e) => {
            setErrorCorreo("");
            const lower = e.toLowerCase();
            setCorreo(lower);
          }}
        />
        <StyledInput
          password={passwordHidden}
          onChangeText={setPassword}
          onIconClick={() => setPasswordHidden(!passwordHidden)}
          placeholder="Ingrese su contraseña"
          label={"Contraseña"}
          value={password}
          errorMessage={errorPassword}
          icon={<Icons password />}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Iniciar sesion"
          color={theme.colors.modernaRed}
          buttonStyle={{ borderRadius: 10 }}
          containerStyle={{
            width: 200,
            paddingTop: 40,
          }}
          size="lg"
          onPress={personaIngreso}
        />
      </View>
      {/* <StyledButton onPress={login} title="Login with Chrome" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
  },
  title: { fontSize: 15, marginTop: 80, marginBottom: 40 },
});
