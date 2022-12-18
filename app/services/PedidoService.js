import {
  PEDIDO_DETALLE_NAME,
  PEDIDO_TABLE_NAME,
} from "../commons/sqlite_config";
import { PEDIDO_TABLE } from "../commons/table_columns";
import { generateUIDD } from "../commons/utils";
import { db_insertDetallePedido } from "../services/SqliteService";
import { getProductoById } from "./ProductoService";

export const insertarDetallePedido = (idPedido, carrito) => {
  carrito?.forEach((element) => {
    console.log("detalle: ", element);
    db_insertDetallePedido(
      generateUIDD(),
      idPedido,
      element.producto.idSap,
      element.cantidad,
      element.precioUnitario,
      element.subTotal
    );
  });
};

export const consultarPedidos = (criteria, setPedidos) => {
  //return productos;
  let query = "select * from " + PEDIDO_TABLE_NAME;
  // if (criteria !== "" && criteria !== undefined) {
  //   query += " where descripcion LIKE '%" + criteria + "%'";
  // }
  console.log("query: " + query);
  global.dbModerna?.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        setPedidos(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + PRODUCTOS_TABLE_NAME);
      }
    );
  });
};
export const consultarDetallePedido = (id, setDetallePedidos) => {
  //return productos;
  let query =
    "select * from " +
    PEDIDO_DETALLE_NAME +
    " WHERE " +
    PEDIDO_TABLE.KEY_1 +
    " = '" +
    id +
    "'";
  // if (criteria !== "" && criteria !== undefined) {
  //   query += " where descripcion LIKE '%" + criteria + "%'";
  // }
  const detalle = [];
  console.log("query: " + query);
  global.dbModerna?.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        // console.log(_array);
        // const response = [];
        // _array.forEach((element) => {
        //   getProductoById(element.idProducto, (e) => {
        //     response.push({
        //       producto: e,
        //       cantidad: element.cantidad,
        //       precioUnitario: element.precioUnitario,
        //       subtotal: element.precioVenta * element.cantidad,
        //     });
        //     console.log("foreach: ", response);
        //   });
        // });
        setDetallePedidos(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + PEDIDO_DETALLE_NAME);
      }
    );
  });
};
export const getUnsincronizedPedidos = (setPedidos) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      "select * from " + PEDIDO_TABLE_NAME + " where sincronizado = 0;",
      [],
      (_, { rows: { _array } }) => {
        setPedidos(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + PEDIDO_TABLE_NAME);
      }
    );
  });
};
export const sincronizarPedido = (id, setPedidos) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      "update " +
        PEDIDO_TABLE_NAME +
        " set sincronizado = '1' where idPedido = '" +
        id +
        "';",
      [],
      () => {
        tx.executeSql(
          "select * from " + PEDIDO_TABLE_NAME + " where sincronizado = 0;",
          (_, { rows: { _array } }) => {
            setPedidos(_array);
          }
        );
      },
      () => {
        console.log("Error al actualizar la tabla " + PEDIDO_TABLE_NAME);
      }
    );
  });
};
