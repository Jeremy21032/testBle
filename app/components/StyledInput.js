import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import theme from "../theme/theme";
import Icons from "./Icons";
import { HelperText, TextInput } from "react-native-paper";

//Entre las props, la variable value y onChangeText deben ser controladas por estados
//si no se manda un placeHolder, se pondrá por defecto Escribe aquí
//si no se manda un label, no se mostrara nada en la parte superior derecha
//prop mayus hace que todo el input se haga mayúscula, email cambia el tipo de teclado para email, numeric para teclado numérico
//para hacer uso del mensaje de error, enviar un estado del mismo en la prop errorMessage
export default function StyledInput({
  label,
  mayus,
  value,
  placeholder,
  onChangeText,
  style,
  icon,
  password,
  errorMessage,
  numeric,
  email,
  max_length = 80,
  noeditable,
  onIconClick,
  lowercase,
  textColor,
  bordBlack
}) {
  return (
    <View style={style}>
      <TextInput
        keyboardType={
          numeric ? "number-pad" : email ? "email-address" : "default"
        }
        label={label}
        value={value}
        mode="outlined"
        textColor={textColor?"#A3A3A3": "black"}
        activeOutlineColor={theme.colors.active}
        outlineColor={bordBlack ? "black":"#A3A3A3"}
        placeholder={placeholder ? placeholder : "Escribe aquí"}
        
        error={errorMessage}
        onChangeText={(e) => {
          if (!onChangeText) {
            return;
          }
          let text = e;
          if (mayus) {
            text = text.toUpperCase();
          }
          onChangeText(text);
        }}
        maxLength={max_length}
        secureTextEntry={password}
        autoCapitalize={mayus ? "characters" : lowercase ? "none" : "sentences"}
        editable={noeditable ? false : true}
        right={
          password != null && (
            <TextInput.Icon
              icon={password === true ? "eye" : "eyeo"}
              onPress={() => {
                if (onIconClick) {
                  onIconClick();
                }
              }}
            />
          )
        }
      />

      <HelperText
        type="error"
        style={{ marginTop: -5, marginBottom: 5 }}
        visible={errorMessage}
      >
        {errorMessage}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  nobackground: {
    backgroundColor: "transparent",
  },
  container: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 10,
    borderColor: theme.colors.inputcolor,
  },
});
