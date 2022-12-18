import { FAB, Icon } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import Icons from "../../components/Icons";
import SearchInput from "../../components/SearchInput";
import { searchClients } from "../../services/ClienteService";
import StyledText from "../../components/StyledText";
import ClienteCard from "./ClienteCard";
import theme from "../../theme/theme";
import { es_EC } from "../../commons/texts";
import Header from "../../components/Header";
//import { NavigationContext } from "../../context/NavigationProvider";
import ModernaContext from "../../context/ModernaContext/ModernaContext";
import { NavigationContext } from "../../context/NavigationProvider";
import { postAzure } from "../../services/backendServices/RestExecutor";

const MINIMUN_ELEMENTS_FOR_SEARCH = 0;

export default function ClientesList({ navigation, route }) {
  const { handleLoutAzure } = useContext(ModernaContext);
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const { setActivate } = useContext(NavigationContext);

  const getClientes = () => {
    //searchClients(search, setClientes);
    getInformationAzureClients({
      "typeQuery": "R"
    });

  };
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     buscarClientes();
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    //buscarClientes();
    console.log("buscando usuario con ", search)
    if (search.length <= 0) {
      getClientes();
    } else {
      getInformationAzureClients({
        "typeQuery": "R",
        "data": {
          "compare": [
            "nombre_cuenta",
            `'${search}'`
          ]
        }
      });
    }

  }, [search]);

  useEffect(() => {
    getClientes();
    setActivate(true);
    const willFocusSubscription = navigation.addListener("focus", () => {
      console.log("trayendo desde focuss")
      getClientes();
      setActivate(true);
    });

    return willFocusSubscription;
  }, []);
  const getInformationAzureClients = (body) => {
    postAzure("https://modernafunctions.azurewebsites.net/api/clientFunction?code=KJ9ZaH3Uup-B9-d9cfZ-bCfzx7_gQyQgFrJMaPADrQv9AzFuD-BOPA==",
      body || {
        "typeQuery": "R"
      },
      successFunctionAzure
      , errorFunctionAzure
    );
  }
  const successFunctionAzure = (data) => {
    console.log("desde succes function cliente", data)
    setClientes(data.data.dataBaseResult)
  }
  const errorFunctionAzure = (data) => {
    console.log("desde error function cliente", data)
  }

  return (
    <View style={styles.container}>
      <Header

      />
      <View style={styles.containerLogout}>
        <TouchableOpacity
          onPress={() => handleLoutAzure()}
          style={styles.btnLog}

        >
          <Icon
            name='logout'
            type='ant-desing'
            size={10}
            color='white'

          />
          {/*<Text style={{ fontWeight: 'bold', color: COLORS.white }}> Salir</Text>*/}
        </TouchableOpacity>
      </View>

      <StyledText heading center bold style={styles.title}>
        CLIENTES
      </StyledText>
      {(MINIMUN_ELEMENTS_FOR_SEARCH < clientes.length || search !== "") && (
        <SearchInput
          value={search}
          onChangeText={setSearch}
          label={es_EC.LABEL_BUSQUEDA}

          style={styles.search}
        />
      )}
      {!clientes || clientes.length === 0 ? (
        <View style={styles.container}>
          {search !== "" ? (
            <StyledText center title bold>
              No hay resultados
            </StyledText>
          ) : (
            <View>
              <StyledText center title bold>
                No hay clientes
              </StyledText>
              <StyledText center subtitle>
                Para iniciar, presiona el botón de agregar
              </StyledText>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item.idCliente}
          data={clientes}
          renderItem={({ item }) => {
            return (
              <ClienteCard
                cliente={item}
                navigation={navigation}
                isChecked={item.sincronizado === 1}
              />
            );
          }}
          style={styles.list}
        />
      )}
      <FAB
        color={theme.colors.modernaGreen}
        placement="right"
        onPress={() => {
          //buscarClientes();
          
          //getClientes();
          setSearch("")
        }}
      >
        <Icons size={25} reload color="white" />
      </FAB>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    position: "relative"
  },
  btnLog: {
    flexDirection: 'column',
    backgroundColor: "orange",
    borderRadius: 5,
    padding: 15,
    alignItems: 'center'
  },
  containerLogout: {
    width: 40,
    height: 40,
    right: 10,
    top: 50,
    position: "absolute"
  },
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
});
