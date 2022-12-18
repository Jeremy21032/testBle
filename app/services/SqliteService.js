import {
  CATEGORIA_TABLE_NAME,
  CLIENTES_TABLE_NAME,
  PEDIDO_DETALLE_NAME,
  PEDIDO_TABLE_NAME,
  PRODUCTOS_TABLE_NAME,
  STOCK_TABLE_NAME,
} from "../commons/sqlite_config";
import {
  CLIENTE_TABLE,
  PEDIDO_DETALLE_TABLE,
  PEDIDO_TABLE,
  PRODUCTO_TABLE,
  STOCK_TABLE,
} from "../commons/table_columns";
import { generateUIDD, getActualDate } from "../commons/utils";

export const db_insertCliente = (
  id,
  nombre,
  identificacion,
  direccion,
  telefono,
  sincronizado
) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      `insert into ${CLIENTES_TABLE_NAME} (${CLIENTE_TABLE.KEY_1},${CLIENTE_TABLE.NOMBRE_2},${CLIENTE_TABLE.IDENTIFICACION_3},${CLIENTE_TABLE.DIRECCION_4},${CLIENTE_TABLE.TELEFONO_5},sincronizado) values (?,?,?,?,?,?);`,
      [id, nombre, identificacion, direccion, telefono, sincronizado],
      () => {
        tx.executeSql(
          "select * from " + CLIENTES_TABLE_NAME,
          [],
          (_, { rows: { _array } }) => {
            //console.log("Arreglo", _array);
          },
          () => {
            console.log("Error al consultar la tabla " + CLIENTES_TABLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + CLIENTES_TABLE_NAME + " OK  "
        );
      },
      () => {
        console.log("error al insertar tabla " + CLIENTES_TABLE_NAME);
      }
    );
  });
};

export const db_insertCategoria = (id, descripcion) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      `
          insert into categoria
              (
              id_categoria,descripcion
              )
          values
              (?, ?);
      `,
      [id, descripcion],
      () => {
        tx.executeSql(
          "select * from " + CATEGORIA_TABLE_NAME,
          [],
          (_, { rows: { _array } }) => {
           // console.log("Arreglo", _array);
          },
          () => {
            console.log("Error al consultar la tabla " + CATEGORIA_TABLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + CATEGORIA_TABLE_NAME + " OK  "
        );
      },
      () => {
        console.error("error al insertar tabla ", CATEGORIA_TABLE_NAME);
      }
    );
  });
};

export const db_insertProducto = (
  id,
  id_categoria,
  descripcion,
  precioVenta,

  iva,
  imagen,


) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      `insert into producto (id_producto_sap,id_categoria,descripcion,precio_venta,iva,imagen) values (?,?,?,?,?,?);`,
      [id,
        id_categoria,
        descripcion,
        precioVenta,

        iva,
        imagen,],
      () => {
        tx.executeSql(
          "select * from producto",
          [],
          (_, { rows: { _array } }) => {
            //console.log("Arreglo", _array);
          },
          () => {
            console.log("Error al consultar la tabla " + PRODUCTOS_TABLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + PRODUCTOS_TABLE_NAME + " OK  "
        );
      },
      () => {
        console.log("error al insertar tabla " + PRODUCTOS_TABLE_NAME);
      }
    );
  });
};

export const db_insertStock = (
  idStock,
  idVendedor,
  idProducto,
  stockInicial,
  stockActual,
  fecha
) => {
  global.dbModerna.transaction((tx) => {
    console.log(
      idStock,
      idVendedor,
      idProducto,
      stockInicial,
      stockActual,
      fecha
    );
    tx.executeSql(
      `insert into ${STOCK_TABLE_NAME} (${STOCK_TABLE.KEY_1}, ${STOCK_TABLE.ID_VENDEDOR_2},
        ${STOCK_TABLE.ID_PRODUCTO_3},
        ${STOCK_TABLE.STOCK_INICIAL_4},
        ${STOCK_TABLE.STOCK_ACTUAL_5},
        ${STOCK_TABLE.FECHA_6}) values (?,?,?,?,?,?);`,
      [idStock, idVendedor, idProducto, stockInicial, stockActual, fecha],
      () => {
        tx.executeSql(
          "select * from " + STOCK_TABLE_NAME,
          [],
          (_, { rows: { _array } }) => {
          //  console.log("Arreglo", _array);
          },
          () => {
            console.log("Error al consultar la tabla " + STOCK_TABLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + STOCK_TABLE_NAME + " OK  "
        );
      },
      () => {
        console.error("error al insertar tabla ", STOCK_TABLE_NAME);
      }
    );
  });
};
export const db_insertPedido = (
  idPedido,
  idVendedor,
  idCliente,
  fecha,
  subtotal,
  iva,
  total,
  textoFactura,
  sincronizado,
  carrito
) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      `insert into ${PEDIDO_TABLE_NAME} (${PEDIDO_TABLE.KEY_1},
        ${PEDIDO_TABLE.ID_VENDEDOR_2},
        ${PEDIDO_TABLE.ID_CLIENTE_3},
        ${PEDIDO_TABLE.FECHA_4},
        ${PEDIDO_TABLE.SUBTOTAL_5},
        ${PEDIDO_TABLE.IVA_6},
        ${PEDIDO_TABLE.TOTAL_7},
        ${PEDIDO_TABLE.TEXTO_FACTURA_8},sincronizado) values (?,?,?,?,?,?,?,?,?);`,
      [
        idPedido,
        idVendedor,
        idCliente,
        fecha,
        subtotal,
        iva,
        total,
        textoFactura,
        sincronizado,
      ],
      () => {
        tx.executeSql(
          "select * from " + PEDIDO_TABLE_NAME,
          [],
          (_, { rows: { _array } }) => {
            //console.log("Arreglo", PEDIDO_TABLE_NAME);
          },
          () => {
            console.log("Error al consultar la tabla " + PEDIDO_TABLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + PEDIDO_TABLE_NAME + " OK  "
        );
        carrito.forEach((element) => {
          console.log("detalle: ", element);
          if (textoFactura === "") {
            db_insertDetallePedido(
              generateUIDD(),
              idPedido,
              element.producto.idSap,
              element.cantidad,
              element.precioUnitario,
              element.subtotal
            );
          } else {
            db_insertDetallePedidoNoStock(
              generateUIDD(),
              idPedido,
              element.producto.idSap,
              element.cantidad,
              element.precioUnitario,
              element.subtotal
            );
          }
        });
      },
      () => {
        console.log("error al insertar tabla " + PEDIDO_TABLE_NAME);
      }
    );
  });
};
export const db_insertDetallePedido = (
  idDetallePedido,
  idPedido,
  idProducto,
  cantidad,
  precioUnitario,
  subTotal
) => {
  global.dbModerna.transaction((tx) => {
    const query = `insert into ${PEDIDO_DETALLE_NAME} (${PEDIDO_DETALLE_TABLE.KEY_1}, ${PEDIDO_DETALLE_TABLE.ID_PEDIDO_2},
      ${PEDIDO_DETALLE_TABLE.ID_PRODUCTO_3},
      ${PEDIDO_DETALLE_TABLE.CANTIDAD_4},
      ${PEDIDO_DETALLE_TABLE.PRECIO_UNITARIO_5},
      ${PEDIDO_DETALLE_TABLE.SUBTOTAL_6}) values (?,?,?,?,?,?);`;
    console.log("query: ", query);
    tx.executeSql(
      query,
      [
        idDetallePedido,
        idPedido,
        idProducto,
        cantidad,
        precioUnitario,
        subTotal,
      ],
      () => {
        let query = `update ${STOCK_TABLE_NAME} SET ${STOCK_TABLE.STOCK_ACTUAL_5} = ${STOCK_TABLE.STOCK_ACTUAL_5} - ${cantidad} WHERE ${STOCK_TABLE.ID_PRODUCTO_3} = "${idProducto}" `;
        console.log("ejecutando reduce stock: ", query);
        tx.executeSql(
          query,
          [],
          (_, { rows: { _array } }) => {
           // console.log("Arreglo", PEDIDO_DETALLE_NAME);
          },
          () => {
            console.log("Error al consultar la tabla " + PEDIDO_DETALLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + PEDIDO_DETALLE_NAME + " OK  "
        );
      },
      () => {
        console.log("error al insertar tabla " + PEDIDO_DETALLE_NAME);
      }
    );
  });
};
export const db_insertDetallePedidoNoStock = (
  idDetallePedido,
  idPedido,
  idProducto,
  cantidad,
  precioUnitario,
  subTotal
) => {
  global.dbModerna.transaction((tx) => {
    const query = `insert into ${PEDIDO_DETALLE_NAME} (${PEDIDO_DETALLE_TABLE.KEY_1}, ${PEDIDO_DETALLE_TABLE.ID_PEDIDO_2},
      ${PEDIDO_DETALLE_TABLE.ID_PRODUCTO_3},
      ${PEDIDO_DETALLE_TABLE.CANTIDAD_4},
      ${PEDIDO_DETALLE_TABLE.PRECIO_UNITARIO_5},
      ${PEDIDO_DETALLE_TABLE.SUBTOTAL_6}) values (?,?,?,?,?,?);`;
    console.log("query: ", query);
    tx.executeSql(
      query,
      [
        idDetallePedido,
        idPedido,
        idProducto,
        cantidad,
        precioUnitario,
        subTotal,
      ],
      () => {
        tx.executeSql(
          "select * from " + PEDIDO_DETALLE_NAME,
          [],
          (_, { rows: { _array } }) => {
          //  console.log("Arreglo", PEDIDO_DETALLE_NAME);
          },
          () => {
            console.log("Error al consultar la tabla " + PEDIDO_DETALLE_NAME);
          }
        );
        console.log(
          "se ejecuta sentencia insert " + PEDIDO_DETALLE_NAME + " OK  "
        );
      },
      () => {
        console.log("error al insertar tabla " + PEDIDO_DETALLE_NAME);
      }
    );
  });
};
