import { useContext, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
// import Header from "./app/components/Header";
// import ClientesList from "./app/screens/clients/ClientesList";
// import RegistroCliente from "./app/screens/clients/RegistroCliente";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { BackHandler, Image, Text, TouchableOpacity, View } from "react-native";

import { SessionContext, SessionProvider } from "./app/context/SessionProvider";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { color, Icon } from "@rneui/base";
import theme from "./app/theme/theme";
import Icons from "./app/components/Icons";
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ConectarImpresora } from "./app/services/ImpresoraService";
import {
  MD3Colors as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import ConexionScreen from "./app/screens/landing/ConexionScreen";
import { NavigationContext } from "./app/context/NavigationProvider";
import ModernaStates from "./app/context/ModernaContext/ModernaStates";
import { Navigation } from "./app/navigation/Navigation";
// import Splash from "./app/screens/landing/Splash";
// import Login from "./app/screens/auth/Login";
// import Auth from "./app/screens/auth/Auth";
// import PedidosList from "./app/screens/orders/PedidosList";
// import PedidoCliente from "./app/screens/orders/PedidoCliente";
// import PedidoResumen from "./app/screens/orders/PedidoResumen";
// import StyledText from "./app/components/StyledText";
// import DescargarDiario from "./app/screens/landing/DescargarDiario";
// import SincronizarClientes from "./app/screens/sync/SincronizarCliente";
// import SincronizarPedidos from "./app/screens/sync/SincronizarPedidos";
// import DescargarArchivos from "./app/screens/sync/DescargarArchivos";
// import SyncScreen from "./app/screens/sync/SyncScreen";
// import Header2 from "./app/components/Header2";
// import Imprimir from "./app/screens/landing/ImpresoraZebra";
// import { Navigation } from "./app/navigation/Navigation";
// import PedidoResumenSinStock from "./app/screens/orders/PedidoResumenSinStock";
// import { dropVendorLocalStorage } from "./app/services/VendedorService";
// import { dropTable, droptTablesToTest } from "./app/commons/sqlite_config";

const StackClientes = createNativeStackNavigator();
const StackPedidos = createNativeStackNavigator();
const StackLogin = createNativeStackNavigator();
const TabsApp = createBottomTabNavigator();
const TabSync = createBottomTabNavigator();
const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "orange",
  },
};

//__________________________________________________________________________________________________________
export default function App() {
  const { sessionUser, sincronizado } = useContext(SessionContext);
  const [appIsReady, setAppIsready] = useState(false);
  const { activate, setActivate } = useContext(NavigationContext);
  //dropVendorLocalStorage();
  // dropTable("categoria");
  // dropTable("producto");



 // dropTable("categoria");
  //dropTable("stock");
  //droptTablesToTest()
  useEffect(() => {
    // console.log("activate: ", activate);
    // ConectarImpresora();
    const inicia = async () => {
      try {
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
      } catch (e) {
        console.log(e);
      } finally {
        setAppIsready(true);
      }
    };
    inicia();
  });
  // if (!appIsReady) {
  //   return <Splash />;
  // }

  return (
    <PaperProvider
      settings={{
        icon: (props) => <AntDesign {...props} />,
      }}
    >
      <ModernaStates>
        <NavigationContainer>
          <Navigation />
          
          <StatusBar />
        </NavigationContainer>
      </ModernaStates>
    </PaperProvider>
  );
}
//__________________________________________________________________________________________________________
const AppTabNavigation = ({ activate, setActivate }) => {
  const navigation = useNavigation();
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
          //position: 'absolute',
          backgroundColor: theme.colors.modernaRed,
          // zIndex: 1,
          // elevation: 1,
          height: 65,
        },
      }}
    >
      {/* <TabsApp.Screen
        name="Impresora"
        component={Impresora}
        
      /> */}
      <TabsApp.Screen
        name="ClientesStack"
        component={ConexionScreen}
        options={{
          tabBarIcon: () => {
            return (
              <TouchableOpacity disabled={true}>
                <Icon
                  name="printer-wireless"
                  type="material-community"
                  size={30}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            );
          },
        }}
      />

      {/* <TabsApp.Screen
        name="ClientesStack2"
        component={ClientesList}
        options={{
          tabBarIcon: () => (
            <TouchableOpacity
              style={{ padding: 18 }}
              onPress={() => {
                setActivate(true);
                navigation.navigate("ClientesStack2");
              }}
            >
              <Icon
                name="supervised-user-circle"
                type="material"
                size={30}
                color={theme.colors.white}
              />
            </TouchableOpacity>
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
            <TouchableOpacity
              style={{ padding: 18 }}
              onPress={() => {
                setActivate(false);
                //console.log("activate en log: ", activate)
                navigation.navigate(PedidosStackNavigation);
              }}
            >
              <Icons list size={30} color={theme.colors.white} />
            </TouchableOpacity>
          ),

          // tabBarButton: () => <TouchableOpacity onPress={() => {
          //   console.log("Presionando el boton del menú")
          // }}><Text>asdfasdf</Text></TouchableOpacity>,
        }}
      /> */}
    </TabsApp.Navigator>
  );
};
//__________________________________________________________________________________________________________
// const LoginStackNavigation = () => {
//   return (
//     <StackLogin.Navigator
//       initialRouteName="DescargarDiario"
//       screenOptions={{ headerShown: false }}
//     >
//       <StackLogin.Screen name="Login" component={Login} />
//       <StackLogin.Screen name="DescargarDiario" component={DescargarDiario} />
//     </StackLogin.Navigator>
//   );
// };

// //__________________________________________________________________________________________________________
// const ClientesStackNavigation = () => {
//   const navigation = useNavigation();
//   return (
//     <StackClientes.Navigator
//       initialRouteName="RegistroCliente"
//       screenOptions={{ headerShown: true, header: () => <Header /> }}
//     >
//       <StackClientes.Screen name="ClientesList" component={ClientesList} />
//       <StackClientes.Screen
//         name="RegistroCliente"
//         options={{
//           header: () => <Header2 back />,
//         }}
//         component={RegistroCliente}
//       />
//       <StackClientes.Screen name="AgregarPedido" component={PedidoCliente} />
//       <StackClientes.Screen
//         options={{ headerShown: false }}
//         name="PedidoResumen"
//         component={PedidoResumen}
//       />
//       <StackClientes.Screen
//         options={{ headerShown: false }}
//         name="PedidoResumen2"
//         component={PedidoResumenSinStock}
//       />
//     </StackClientes.Navigator>
//   );
// };

// //__________________________________________________________________________________________________________
// const PedidosStackNavigation = () => {
//   return (
//     <StackClientes.Navigator
//       initialRouteName="PedidosList"
//       screenOptions={{ headerShown: true, header: () => <Header /> }}
//     >
//       <StackClientes.Screen name="PedidosList" component={PedidosList} />
//       <StackClientes.Screen
//         name="PedidoResumen"
//         options={{ headerShown: false }}
//         component={PedidoResumen}
//       />
//     </StackClientes.Navigator>
//   );
// };

// //__________________________________________________________________________________________________________
// const SyncTabNavigation = () => {
//   return (
//     <TabsApp.Navigator
//       initialRouteName="SynClientes"
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: { backgroundColor: theme.colors.modernaRed, height: 65 },
//       }}
//     >
//       <TabsApp.Screen
//         name="SynClientes"
//         component={SincronizarClientes}
//         options={{
//           headerShown: false,
//           tabBarIcon: () => (
//             <Icon
//               name="supervised-user-circle"
//               type="material"
//               size={30}
//               color={theme.colors.white}
//             />
//           ),
//         }}
//       />
//       <TabsApp.Screen
//         name="SynPedidos"
//         component={SincronizarPedidos}
//         options={{
//           headerShown: false,
//           tabBarIcon: () => (
//             <Icons product size={30} color={theme.colors.white} />
//           ),
//         }}
//       />
//       <TabsApp.Screen
//         name="DescargarArchivos"
//         component={DescargarArchivos}
//         options={{
//           headerShown: false,
//           tabBarIcon: () => (
//             <Icons download size={30} color={theme.colors.white} />
//           ),
//         }}
//       />
//     </TabsApp.Navigator>
//   );
// };
