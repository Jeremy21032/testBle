import { useNavigation } from "@react-navigation/native";
import { FAB } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import StyledText from "../../components/StyledText";
import { postAzure } from "../../services/backendServices/RestExecutor";
import {
  getUnsincronizedClients,
  sincronizarCliente,
} from "../../services/ClienteService";
import {
  getUnsincronizedPedidos,
  sincronizarPedido,
} from "../../services/PedidoService";
import theme from "../../theme/theme";
import ClienteCard from "../clients/ClienteCard";
import PedidoShortCard from "../orders/PedidoShortCard";

export default function SincronizarListItems({ title, clientes, pedidos }) {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selected, setSelected] = useState([]);
  const [elements, setElements] = useState([]);

  const navigation = useNavigation();

  const selectUnselectAll = () => {
    setIsAllSelected(!isAllSelected);
    setSelected(Array(elements.length).fill(!isAllSelected));
  };

  useEffect(() => {
    getItems();
    const willFocusSubscription = navigation?.addListener("focus", () => {
      getItems();
    });

    return willFocusSubscription;
  }, []);

  const toggleSelection = (index) => {
    const array = [...selected];
    array[index] = !array[index];
    setSelected(array);
  };

  const checkIfAllSelected = () => {
    let allSelected = true;
    selected.forEach((item) => {
      if (item === false) {
        allSelected = false;
        return;
      }
    });
    setIsAllSelected(allSelected);
  };

  useEffect(() => {
    checkIfAllSelected();
  }, [selected]);

  const getItems = (update) => {
     clientes
       ? getUnsincronizedClients(setElements)
       : pedidos && getUnsincronizedPedidos(setElements);
    /*clientes
      ? getInformationAzureClients()
      : pedidos && getUnsincronizedPedidos(setElements);*/
  };

  const getInformationAzureClients = () => {
    postAzure("https://modernafunctions.azurewebsites.net/api/clientFunction?code=KJ9ZaH3Uup-B9-d9cfZ-bCfzx7_gQyQgFrJMaPADrQv9AzFuD-BOPA==",
      {
        "typeQuery": "R"
      },
      successFunctionAzure
      , errorFunctionAzure
    );
  }
  const successFunctionAzure = (data) => {
    console.log("desde succes function cliente", data)
    setElements(data.data.dataBaseResult)
  }
  const errorFunctionAzure = (data) => {
    console.log("desde error function cliente", data)
  }
  useEffect(() => {
    getItems(true);
  }, []);

  const sincronizar = () => {
    elements.forEach((element, index) => {
      if (selected[index]) {
        clientes
          ? sincronizarCliente(element.idCliente, setElements)
          : sincronizarPedido(element.idPedido, setElements);
      }
    });
    getItems();
    setSelected(Array(elements.length).fill(false));
  };

  return (
    <View style={styles.container}>
      <StyledText heading center bold style={styles.title}>
        {title.toUpperCase()}
      </StyledText>
      <View>
        {elements.length > 1 && (
          <TouchableOpacity
            style={styles.selection}
            onPress={selectUnselectAll}
          >
            <StyledText>
              {isAllSelected ? "Deseleccionar" : "Seleccionar"} todo
            </StyledText>
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: isAllSelected
                    ? theme.colors.active
                    : theme.colors.white,
                },
              ]}
            />
          </TouchableOpacity>
        )}
        {!elements || elements.length === 0 ? (
          <View>
            <StyledText center title bold>
              No hay {title.toLowerCase()} por sincronizar
            </StyledText>
          </View>
        ) : clientes || pedidos ? (
          <FlatList
            keyExtractor={(item) =>
              clientes ? item?.idCliente : item?.idPedido
            }
            data={elements}
            renderItem={({ item, index }) => {
              return clientes ? (
                <ClienteCard
                  cliente={item}
                  isChecked={selected[index]}
                  onCheckTouch={() => {
                    toggleSelection(index);
                  }}
                />
              ) : (
                <PedidoShortCard
                  pedido={item}
                  isChecked={selected[index]}
                  onCheckTouch={() => {
                    toggleSelection(index);
                  }}
                />
              );
            }}
            style={styles.list}
          />
        ) : (
          <StyledText modernaPrimary center bold>
            Must provide the type of element to render
          </StyledText>
        )}
      </View>
      <FAB
        icon={{ name: "send", color: "white" }}
        color={theme.colors.modernaAqua}
        placement="right"
        size="large"
        onPress={sincronizar}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    marginTop: 0,
    marginBottom: 50,
    paddingHorizontal: 15,
  },
  title: {
    marginBottom: 15,
  },
  search: {
    marginBottom: 0,
  },
  selection: {
    paddingHorizontal: 30,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  circle: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 50,
    marginLeft: 10,
  },
});
