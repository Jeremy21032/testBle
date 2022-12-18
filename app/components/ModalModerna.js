import React from "react";
import { Dimensions, StyleSheet, View, Modal } from "react-native";
import { Button } from "react-native-paper";
import theme from "../theme/theme";
import Header from "./Header";
import StyledButton from "./StyledButton";
import StyledText from "./StyledText";

export default function ModalModerna({
  visible,
  setVisible,
  title,
  subtitle,
  onCancel,
  onSubmit,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setVisible(!visible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Header style={{ marginTop: -70 }} />
          <StyledText bold subtitle center style={{ marginBottom: 25 }}>
            {title}
          </StyledText>
          <StyledText modernaPrimary style={{ marginBottom: 10 }}>
            {subtitle}
          </StyledText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <StyledButton
              title="Cancelar"
              secondary
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (onCancel) {
                  onCancel();
                }
                setVisible(!visible);
              }}
            />
            <StyledButton
              title="Si"
              primary
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                if (onSubmit) {
                  onSubmit();
                }
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    backgroundColor: "white",
    // borderRadius: 20,
    padding: 35,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: { width: Dimensions.get("window").width / 3, marginHorizontal: 20 },
});
