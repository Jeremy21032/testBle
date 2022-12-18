import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BackHandler, Image, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "../../app/components/Header";

import React, { useContext, useEffect, useState } from "react";
import {
  MD3Colors as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { color, Icon } from "@rneui/base";

import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import ModernaContext from "../context/ModernaContext/ModernaContext";
import Login from "../screens/auth/Login";
import ClientesList from "../screens/clients/ClientesList";
import ConexionScreen from "../screens/landing/ConexionScreen";
import DescargarDiario from "../screens/landing/DescargarDiario";
import PedidoCliente from "../screens/orders/PedidoCliente";
import PedidoResumen from "../screens/orders/PedidoResumen";
import PedidosList from "../screens/orders/PedidosList";
import SincronizarClientes from "../screens/sync/SincronizarCliente";
import SincronizarPedidos from "../screens/sync/SincronizarPedidos"; 
import Icons from "../components/Icons";
import theme from "../theme/theme";
import Header2 from "../components/Header2";
import Splash from "../screens/landing/Splash";
import RegistroCliente from "../screens/clients/RegistroCliente";
import { NavigationContext } from "../context/NavigationProvider";
import { SessionContext } from "../context/SessionProvider";
import PedidoResumenSinStock from "../screens/orders/PedidoResumenSinStock";
import { checkerStartDayInit, insertNewStartDayInit, updateNewStartDayInit } from "../services/StartDayService";
const StackClientes = createNativeStackNavigator();
const StackPedidos = createNativeStackNavigator();
const StackLogin = createNativeStackNavigator();
const StackLogued = createNativeStackNavigator();
const TabsApp = createBottomTabNavigator();
const TabSync = createBottomTabNavigator();
const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "orange",
  },
};
export const Navigation = () => {
  const { isAutenticated, azuerUser, loadIsNewDay, handleCurrentUserAutenticated } = useContext(ModernaContext);
  const [activate, setActivate] = useState(true);
  useEffect(() => {
    const initData = async () => {
      handleCurrentUserAutenticated()
     

    }
    initData();
  }, [])
  useEffect(() => {
    const initData = async () => {

      await insertNewStartDayInit(azuerUser.mail);
      await checkerStartDayInit(loadIsNewDay,azuerUser.mail);
      
    }
    if (azuerUser) {
      initData();
    }

  }, [azuerUser])
  return <>
    {
      isAutenticated == null ? <Login /> : isAutenticated == true ? <CheckStatusSyncDay /> :
        <LoginStackNavigation />
    }
  </>
}


const AppTabNavigation = ({ activate, setActivate }) => {
  const navigation = useNavigation();
  const { statusImpresora } = useContext(NavigationContext);
  // console.log("Props: ", activate)
  return (
    <TabsApp.Navigator
      initialRouteName="ClientesStack2"
      screenOptions={{
        tabBarActiveTintColor: "cyan",
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // position: 'absolute',
          backgroundColor: theme.colors.modernaRed,
          height: 65,
        },
      }}
    >

      <TabsApp.Screen
        name="ClientesStack"
        component={ConexionScreen}
        options={{
          tabBarIcon: () => {
            return (




              <Icon
                name="printer-wireless"
                type="material-community"
                size={30}
                color={statusImpresora ? '#00b347' : theme.colors.white}
              //style={{backgroundColor:'black'}}
              />


            );
          },
        }}
      />




      <TabsApp.Screen
        name="ClientesStack2"
        component={ClientesList}
        options={{
          tabBarIcon: () => (
            // <TouchableOpacity
            //   style={{ padding: 18 }}
            //   onPress={() => {
            //     setActivate(true);
            //     navigation.navigate("ClientesStack2");
            //   }}
            // >
            <Icon
              name="supervised-user-circle"
              type="material"
              size={30}
              color={theme.colors.white}
            />
            // </TouchableOpacity>
          ),
        }}
      />

      {activate == true ? (
        <TabsApp.Screen
          name="ButtonPlus"
          component={ClientesStackNavigation}
          options={{
            tabBarStyle: { display: "none" },
            // tabBarButton: () => (<CustomTabBarButton />)
            tabBarIcon: () => (
              <View
                style={{
                  bottom: 33,
                  backgroundColor: "white",
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                  height: 80,
                }}
              >
                <Icon
                  name="plus"
                  type="entypo"
                  color="white"
                  style={{
                    borderRadius: 50,
                    backgroundColor: theme.colors.modernaYellow,
                    padding: 15,
                  }}
                  size={35}
                />
              </View>
            ),
            // tabBarIcon: () => <Icons sync size={30} color={theme.colors.white} />,
          }}
        />
      ) : (
        <></>
      )}
      <TabsApp.Screen
        name="ClientesStack3"
        component={SyncTabNavigation}
        options={{
          tabBarStyle: { display: "none" },
          tabBarIcon: () => <Icons sync size={30} color={theme.colors.white} />,
        }}
      />

      <TabsApp.Screen
        name="PedidosStackNavigation"
        component={PedidosStackNavigation}
        options={{
          tabBarIcon: () => (
            // <TouchableOpacity
            //   style={{ padding: 18 }}
            //   onPress={() => {
            //     setActivate(false);
            //     //console.log("activate en log: ", activate)
            //     navigation.navigate(PedidosStackNavigation);
            //   }}
            // >
            <Icons list size={30} color={theme.colors.white} />
            // </TouchableOpacity>
          ),

          // tabBarButton: () => <TouchableOpacity onPress={() => {
          //   console.log("Presionando el boton del menú")
          // }}><Text>asdfasdf</Text></TouchableOpacity>,
        }}
      />
    </TabsApp.Navigator>
  );
};
//__________________________________________________________________________________________________________
const LoginStackNavigation = () => {
  return (
    <StackLogin.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <StackLogin.Screen name="Login" component={Login} />

    </StackLogin.Navigator>
  );
};

/*
const checkStatusSyncDay = () => {
 
  return (
    <StackLogued.Navigator
      initialRouteName="DescargarDiario"
      screenOptions={{ headerShown: false }}
    >
      <StackLogued.Screen name="DescargarDiario" component={DescargarDiario} />
      <StackLogued.Screen name="AppTabNavigation" component={AppTabNavigation} />

    </StackLogued.Navigator>
  );
};
*/

const CheckStatusSyncDay = () => {
  const { isNewDay } = useContext(ModernaContext);
  //const [activate, setActivate] = useState(true);
  const { activate, setActivate } = useContext(NavigationContext);
  return (
    <>
      {
        isNewDay ?  <DescargarDiario></DescargarDiario>:<AppTabNavigation activate={activate} setActivate={setActivate}></AppTabNavigation>
      }
    </>
  );
};








//__________________________________________________________________________________________________________
const ClientesStackNavigation = () => {
  const navigation = useNavigation();
  return (
    <StackClientes.Navigator
      initialRouteName="RegistroCliente"
      screenOptions={{ headerShown: true, header: () => <Header /> }}
    >
      <StackClientes.Screen name="ClientesList" component={ClientesList} />
      <StackClientes.Screen
        name="RegistroCliente"
        options={{
          header: () => (<Header2 back />),
        }}
        component={RegistroCliente}
      />
      <StackClientes.Screen name="AgregarPedido" component={PedidoCliente} />
      <StackClientes.Screen
        options={{ headerShown: false }}
        name="PedidoResumen"
        component={PedidoResumen}
      />
      <StackClientes.Screen
        options={{ headerShown: false }}
        name="PedidoResumen2"
        component={PedidoResumenSinStock}
      />
    </StackClientes.Navigator>
  );
};

//__________________________________________________________________________________________________________
const PedidosStackNavigation = () => {
  return (
    <StackClientes.Navigator
      initialRouteName="PedidosList"
      screenOptions={{ headerShown: true, header: () => <Header /> }}
    >
      <StackClientes.Screen name="PedidosList" component={PedidosList} />
      <StackClientes.Screen
        name="PedidoResumen"
        options={{ headerShown: false }}
        component={PedidoResumen}
      />
    </StackClientes.Navigator>
  );
};

//__________________________________________________________________________________________________________
const SyncTabNavigation = () => {
  return (
    <TabsApp.Navigator
      initialRouteName="SynClientes"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: theme.colors.modernaRed, height: 65 },
      }}
    >
      <TabsApp.Screen
        name="SynClientes"
        component={SincronizarClientes}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Icon
              name="supervised-user-circle"
              type="material"
              size={30}
              color={theme.colors.white}
            />
          ),
        }}
      />
      <TabsApp.Screen
        name="SynPedidos"
        component={SincronizarPedidos}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Icons product size={30} color={theme.colors.white} />
          ),
        }}
      />
      <TabsApp.Screen
        name="DescargarArchivos"
        component={DescargarArchivos}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Icons download size={30} color={theme.colors.white} />
          ),
        }}
      />
    </TabsApp.Navigator>
  );
};