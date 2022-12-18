import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Button, color } from "@rneui/base";
import theme from "../../theme/theme";
import Header from "../../components/Header";
import SplashDescarga from "./SplashDescarga";
import Spinner from "react-native-loading-spinner-overlay";
import { SessionContext } from "../../context/SessionProvider";
import Constants from "expo-constants";
import {
  db_insertCategoria,
  db_insertProducto,
  db_insertStock,
} from "../../services/SqliteService";
import {
  consultarCategoriasLocalStorage,
  consultarProductosLocalStorage,
} from "../../services/ProductoService";
import { generateUIDD, getActualDate } from "../../commons/utils";
import { postAzure } from "../../services/backendServices/RestExecutor";
import { updateNewStartDayInit } from "../../services/StartDayService";
import ModernaContext from "../../context/ModernaContext/ModernaContext";

export default function DescargarDiario({ navigation }) {
  const { azuerUser,loadIsNewDay } = useContext(ModernaContext)
  const [estado, setEstado] = useState(false);
  //const [first, setfirst] = useState(second);
  const [productos, setProductos] = useState();
  const [categories, setCategories] = useState();

  const [appIsReady, setAppIsready] = useState(false);
  const [productosList, setProductosList] = useState([]);

  const { setSincronizado } = useContext(SessionContext);

  let productosTmp;
  let categoriasTmp;
  // useEffect(() => {
  //   if (estado == false) {
  //     return;
  //   }
  //   setTimeout(() => {
  //     setSincronizado(true);
  //     setEstado(false);
  //   }, 1000);
  // }, [estado]);
  //   if (!appIsReady) {
  //     return <Splash />;
  //   }
  // useEffect(() => {
  //   try {

  //     cargarInformacion(productos, categories);


  //   } catch (e) {
  //     console.error(e);
  //   }

  // }, [productos])

  const getProducts = (categoriasTmp) => {
    postAzure("https://modernafunctions.azurewebsites.net/api/functionProducts?code=Fw7jF4G3U2hJUPtpr_TyNFibeEXXhQkk4Z--fyGC1sHeAzFuVbGy0Q==",
      {
        "typeQuery": "R"
      },
      (bodyResponse) => {

        // setProductos(bodyResponse.data.dataBaseResult);
        productosTmp = bodyResponse.data.dataBaseResult;
        setTimeout(() => {

          cargarInformacion(productosTmp, categoriasTmp);
        }, 2000)
        console.warn("PRODUCTOS", productosTmp);
        // getCategorie();
      },
      (e) => {
        //console.error(e)
        setEstado(e);
        setSincronizado(false);
      }
    )

  }
  const getCategorie = async () => {
    try {
      let isOk = false;
      await postAzure("https://modernafunctions.azurewebsites.net/api/functionCategory?code=NkQMlHNxxOHOL5QzSRTmRd9aX-4gkdQwfxc4oiAYxFJxAzFuJlmJnw==",
        {
          "typeQuery": "R"
        },
        (bodyResponse) => {
          let categoriasTmp = bodyResponse.data.dataBaseResult;
          categoriasTmp.forEach(
            (element) => {
              try{
                db_insertCategoria(element.id_categoria, element.descripcion);

              }catch(e){
                console.log("error al insertar item de categoria"+e+element)
              }

            }
          )
          console.log("todo bien sincronizado categorias")

        },
        (e) => {

          isOk = true;


          console.error(e)
        }
      )
      await postAzure("https://modernafunctions.azurewebsites.net/api/functionProducts?code=Fw7jF4G3U2hJUPtpr_TyNFibeEXXhQkk4Z--fyGC1sHeAzFuVbGy0Q==",
        {
          "typeQuery": "R"
        },
        (bodyResponse) => {
          let products = bodyResponse.data.dataBaseResult;
          products.forEach(
            (element) => {
              try{
                db_insertProducto(
                  element.id_producto_sap,
                  element.id_categoria,
                  element.descripcion,
                  element.precio_venta,
                  element.iva,
                  element.imagen,
  
                );

              }catch(e){
                console.log("error al insertar item de producto"+e+element)
              }
             
            }
          )
          console.log("todo bien sincronizado productos")

        },
        (e) => {
          isOk = true;

          console.error(e)
        }
      )
      await postAzure("https://modernafunctions.azurewebsites.net/api/functionStock?code=f0GwnniSqttlOggL-9HMeMQlB3LRkZLCWm5JzEhgbH5LAzFuumO7Pw==",
        {
          "typeQuery": "R"
        },
        (bodyResponse) => {
          let stockTemp = bodyResponse.data.dataBaseResult;
          stockTemp.forEach(
            (element) => {
              try{
                db_insertStock(
                  element.id_stock,
                  element.id_vendedor,
                  element.id_producto_sap,
                  element.stock_inicial,
                  element.stock_actual,
                  element.fecha,
                  );

              }catch(e){
                console.log("error al insertar item de producto"+e+element)
              }
             
            }
          )
          console.log("todo bien sincronizado stocks")

        },
        (e) => {
          isOk = true;
          console.error(e)
        }
      )
      setEstado(false);
      loadIsNewDay(isOk);
      await updateNewStartDayInit(isOk, azuerUser.mail)
    } catch (e) {
      loadIsNewDay(true);
      setEstado(false);
      await updateNewStartDayInit(false, azuerUser.mail)
      console.log("error en catch de cargar datos initday")

    }
  }
  const cargarInformacion = (products, categories) => {
    // if (categories && productos) {
    try {


      console.warn("CARGAR PRODUCTOS", products)
      console.warn("CARGAR CATEGORIAS", categories)

      if (true) {
        categories.forEach(
          (element) => {

            db_insertCategoria(element.id_categoria, element.descripcion);
          }
        )
      }
      if (true) {
        products?.forEach((element, index) => {
          db_insertProducto(
            element.id_producto_sap,
            element.id_categoria,
            element.descripcion,
            element.precio_venta,

            element.iva,
            element.imagen,

          );
        });
        products?.forEach((element, index) => {
          const stock = Math.floor(Math.random() * 50);
          db_insertStock(
            generateUIDD(),
            1,
            element.id_producto_sap,
            stock,
            stock,
            getActualDate()
          );
        });
      }
    } catch (e) {
      console.error(e);
    }
    setEstado(false);
    setSincronizado(true);
    // }

  };
  useEffect(() => {
    if (true) {
      productosList?.forEach((element, index) => {
        const stock = Math.floor(Math.random() * 50);
        db_insertStock(
          generateUIDD(),
          1,
          element.idSap,
          stock,
          stock,
          getActualDate()
        );
      });
    }
  }, [productosList]);

  const insertStock = () => {
    consultarProductosLocalStorage("", setProductosList);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header
        scale={1.2}
        style={{ top: Constants.statusBarHeight, position: "absolute" }}
      />

      <View style={styles.container}>
        <Spinner
          visible={estado}
          textContent={"Descargando..."}
          textStyle={{ color: "white" }}
          color="white"
          overlayColor="rgba(3, 3, 3, 0.52)"
        //textStyle={{ color: "white" }}
        />
        <Button
          size="lg"
          title="Empezar día "
          icon={{
            name: "cloud-download",
            color: "white",
            type: "font-awesome",
          }}
          color={theme.colors.modernaRed}
          buttonStyle={{
            borderRadius: 10,
          }}
          iconRight
          titleStyle={{ fontWeight: "700" }}
          onPress={() => {
            // cargarInformacion();
            setEstado(true);
            getCategorie();
          }}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
