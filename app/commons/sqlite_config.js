import { openDatabase } from "expo-sqlite";
import { Platform } from "react-native";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { insertNewStartDayInit } from "../services/StartDayService";
import { requestMultiple } from "react-native-permissions";
import DeviceInfo from 'react-native-device-info'
import {
  CLIENTE_TABLE,
  PEDIDO_DETALLE_TABLE,
  PEDIDO_TABLE,
  PRODUCTO_TABLE,
  START_DAY_TABLE,
  STOCK_TABLE,
  VENDEDOR_TABLE,
} from "./table_columns";
const DATABASE_NAME = "MODERNA";
export const CLIENTES_TABLE_NAME = "clientes";
export const PRODUCTOS_TABLE_NAME = "producto";
export const CATEGORIA_TABLE_NAME = "categorias";
export const STOCK_TABLE_NAME = "stock";
export const VENDOR_TABLE_NAME = "vendedor";
export const PEDIDO_TABLE_NAME = "pedidos";
export const PEDIDO_DETALLE_NAME = "pedidos_detalle";

const instantiate_local_database = () => {
  if (global.dbModerna == null) {
    global.dbModerna = openDatabase(DATABASE_NAME);
  }
};

const createClienteTable = () => {
  const sentence = `create table if not exists ${CLIENTES_TABLE_NAME} (${CLIENTE_TABLE.KEY_1} text primary key not null, ${CLIENTE_TABLE.NOMBRE_2} text not null, ${CLIENTE_TABLE.IDENTIFICACION_3} text not null,  ${CLIENTE_TABLE.DIRECCION_4} text not null, ${CLIENTE_TABLE.TELEFONO_5} text not null, sincronizado boolean not null);`;
  createTable(sentence, CLIENTES_TABLE_NAME);
};

const createCategoriaTable = () => {
  const sentence = `create table if not exists categoria (id_categoria int primary key not null, descripcion text not null);`;
  createTable(sentence, "categoria");
};
export const createProductoTable = () => {
  const sentence = `create table if not exists producto ( id_producto_sap int primary key not null, id_categoria int,descripcion text,precio_venta money, iva bit,imagen text , FOREIGN KEY(id_categoria) REFERENCES categoria(id_categoria));`;
  createTable(sentence, "producto");
};

const createStockTable = () => {
  const sentence = `create table if not exists ${STOCK_TABLE_NAME} (${STOCK_TABLE.KEY_1} text primary key not null, ${STOCK_TABLE.ID_VENDEDOR_2} text not null, ${STOCK_TABLE.ID_PRODUCTO_3} text not null, ${STOCK_TABLE.STOCK_INICIAL_4} integer not null, ${STOCK_TABLE.STOCK_ACTUAL_5} integer not null, ${STOCK_TABLE.FECHA_6} text not null,FOREIGN KEY(${STOCK_TABLE.ID_PRODUCTO_3}) REFERENCES productos(${PRODUCTO_TABLE.KEY_1}));`;
  createTable(sentence, STOCK_TABLE_NAME);
};

const createStartDayTable =async () => {
  const sentence = `create table if not exists ${START_DAY_TABLE.TABLE_NAME} (${START_DAY_TABLE.KEY_1} text primary key not null, ${START_DAY_TABLE.ITEM_2} boolean)`;
  await createTable(sentence, START_DAY_TABLE.TABLE_NAME);
  return;
};

export const createVendedorTable = () => {
  const sentence = `create table if not exists vendedor (id_vendedor int primary key not null,nombre text , correo text , centro text, almacen text, codigo_prodiverso text, azure_user text );`;
  createTable(sentence, VENDOR_TABLE_NAME);
};
const createPedidoTable = () => {
  const sentence = `create table if not exists ${PEDIDO_TABLE_NAME} (${PEDIDO_TABLE.KEY_1} text primary key not null,${PEDIDO_TABLE.ID_VENDEDOR_2} text not null, ${PEDIDO_TABLE.ID_CLIENTE_3} text not null, ${PEDIDO_TABLE.FECHA_4} text not null, ${PEDIDO_TABLE.SUBTOTAL_5} float not null, ${PEDIDO_TABLE.IVA_6} float not null, ${PEDIDO_TABLE.TOTAL_7} float not null, ${PEDIDO_TABLE.TEXTO_FACTURA_8} text not null, sincronizado boolean not null,FOREIGN KEY(${PEDIDO_TABLE.ID_CLIENTE_3}) REFERENCES clientes(${CLIENTE_TABLE.KEY_1}) )`;
  createTable(sentence, PEDIDO_TABLE_NAME);
};
const createPedidoDetalleTable = () => {
  const sentence = `create table if not exists ${PEDIDO_DETALLE_NAME} (${PEDIDO_DETALLE_TABLE.KEY_1} text primary key not null, ${PEDIDO_DETALLE_TABLE.ID_PEDIDO_2} text not null, ${PEDIDO_DETALLE_TABLE.ID_PRODUCTO_3} text not null,${PEDIDO_DETALLE_TABLE.CANTIDAD_4} integer not null, ${PEDIDO_DETALLE_TABLE.PRECIO_UNITARIO_5} float not null, ${PEDIDO_DETALLE_TABLE.SUBTOTAL_6} float not null, FOREIGN KEY(${PEDIDO_DETALLE_TABLE.ID_PEDIDO_2}) REFERENCES pedidos(${PEDIDO_TABLE.KEY_1}),FOREIGN KEY(${PEDIDO_DETALLE_TABLE.ID_PRODUCTO_3}) REFERENCES productos(${PRODUCTO_TABLE.KEY_1}) )`;
  createTable(sentence, PEDIDO_DETALLE_NAME);
};
const createTable = async(sentence, table_name) => {
  console.log(sentence);
  global.dbModerna.transaction((tx) => {
    try {
      tx.executeSql(
        sentence,
        [],
        () => {
          tx.executeSql(
            "select * from " + table_name + ";",
            [],
            (_, { rows: { _array } }) => {
              // console.log("Arreglo", _array);
            },
            () => {
              console.log("Error al consultar la tabla " + table_name);
            }
          );
          console.log(
            "Se ejecuta sentencia create table " + table_name + " OK"
          );
        },
        () => {
          console.log("error al crear tabla: " + table_name);
        }
      );
    } catch (error) {
      console.error("Something happend in createTable: ", error);
    }
  });
  return;
};
export const dropTable = (table_name) => {
  if (!table_name) {
    return;
  }
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      "drop table " + table_name,
      [],
      () => {
        console.log("borra tabla " + table_name);
      },
      () => {
        console.log("error al borrar tabla " + table_name);
      }
    );
  });
};
export const droptTablesToTest = () => {
  dropTable(CLIENTES_TABLE_NAME);
  dropTable(PEDIDO_TABLE_NAME);
  dropTable(PEDIDO_DETALLE_NAME);
  dropTable(PRODUCTOS_TABLE_NAME);
  dropTable(CATEGORIA_TABLE_NAME);
  dropTable(PRODUCTOS_TABLE_NAME);
  dropTable(STOCK_TABLE_NAME);
  dropTable("categoria");
  dropTable("producto");
  dropTable(START_DAY_TABLE.TABLE_NAME);
};

export const load_db_config = async () => {
  requestPermissions()
  instantiate_local_database();
  // droptTablesToTest();
 await createStartDayTable();
  createVendedorTable();
  createClienteTable();
  createCategoriaTable();
  setTimeout(createProductoTable, 2000);
  createStockTable();
  createPedidoTable();
  createPedidoDetalleTable();

};
export const requestPermissions = async () => {
  const apiLevel = await DeviceInfo.getApiLevel();
  if (Platform.OS === "android") {
    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted;
    } else {
      const result = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
      );

      const isAllPermissionGranted =
        result["android.presmission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.presmission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result["android.presmission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED;
      console.warm("permissions: ", isAllPermissionGranted);
    }
  }
};

export const validatePermission = async () => {
  let permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL
      : (PERMISSIONS.ANDROID.BLUETOOTH,PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
  try {
    let result = await request(permission);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.error(
          "Bluetooth is not available (on this device / in this context)"
        );
        break;
      case RESULTS.DENIED:
        console.error(
          "The Bluetooth permission has not been requested / is denied but requestable"
        );
        break;
      case RESULTS.LIMITED:
        console.error(
          "The Bluetooth permission is limited: some actions are possible"
        );
        break;
      case RESULTS.GRANTED:
        console.log("The Bluetooth permission is granted");
        return true;
      case RESULTS.BLOCKED:
        console.error(
          "The Bluetooth permission is denied and not requestable anymore"
        );
        break;
    }
  } catch (error) {
    console.log("The Bluetooth permission request failed: ", error);
  }
};
