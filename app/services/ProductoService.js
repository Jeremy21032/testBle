import { PRODUCTOS_TABLE_NAME } from "../commons/sqlite_config";
import { generateUIDD } from "../commons/utils";
import { db_insertCategoria, db_insertProducto } from "./SqliteService";

// if (true) {
//   db_insertCategoria(1, "Harinas");
//   db_insertCategoria(2, "Panes");
//   db_insertCategoria(3, "Fideos");
// }

export const productos = [
  {
    idSap: "001",
    descripcion: "Harina",
    precioVenta: 20,
    iva: true,
    imagen:
      "https://modernaalimentos.com.ec/wp-content/uploads/2022/01/moderna-alimentos-harina-key-plus.jpg",
  },
  {
    idSap: "002",
    descripcion: "Pan",
    precioVenta: 10,
    iva: false,
    imagen:
      "https://modernaalimentos.com.ec/wp-content/uploads/2022/01/moderna-alimentos-harina-key-plus.jpg",
  },
  {
    idSap: "003",
    descripcion: "Fideos",
    precioVenta: 30,
    iva: true,
    imagen:
      "https://modernaalimentos.com.ec/wp-content/uploads/2022/01/moderna-alimentos-harina-key-plus.jpg",
  },
  {
    idSap: '004',
    descripcion: "Harina YA",
    precioVenta: 30,
    iva: true,
    imagen:
      "https://modernaalimentos.com.ec/wp-content/uploads/2022/01/moderna-alimentos-harina-key-plus.jpg",
  },
  {
    idSap: '005',
    descripcion: "Harina Premium",
    precioVenta: 30,
    iva: true,
    imagen:
      "https://modernaalimentos.com.ec/wp-content/uploads/2022/01/moderna-alimentos-harina-key-plus.jpg",
  },
];
// db_insertProducto(
//   productos[0].idSap,
//   productos[0].descripcion,
//   productos[0].imagen,
//   productos[0].iva,
//   productos[0].precioVenta,
//   1
// );
// if (true) {
//   productos.forEach((element, index) => {
//     db_insertProducto(
//       element.idSap,
//       element.descripcion,
//       element.imagen,
//       element.precioVenta,
//       element.iva,
//       index
//     );
//   });
// }

export const consultarProductos = () => {
  return productos;
};
export const consultarProductosLocalStorage = (criteria, setProductos) => {
  //return productos;
  let query = "select * from " + PRODUCTOS_TABLE_NAME;
  // if (criteria !== "" && criteria !== undefined) {
  //   query += " where descripcion LIKE '%" + criteria + "%'";
  // }
  console.log("query: " + query);
  global.dbModerna?.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        setProductos(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + PRODUCTOS_TABLE_NAME);
      }
    );
  });
};

export const consultarCategoriasLocalStorage = (criteria, setProductos) => {
  //return productos;
  let query = "select * from categoria";
  // if (criteria !== "" && criteria !== undefined) {
  //   query += " where descripcion LIKE '%" + criteria + "%'";
  // }
  console.log("query: " + query);
  global.dbModerna?.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        setProductos(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + PRODUCTOS_TABLE_NAME);
      }
    );
  });
};


export const getProductoById = (id, setProducto) => {
  let query =
    "select * from " + PRODUCTOS_TABLE_NAME + " WHERE id_producto_sap = '" + id + "';";
  console.log(query);
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        setProducto(_array[0]);
      },
      () => {
        console.log("Error al consultar la tabla " + PRODUCTOS_TABLE_NAME);
      }
    );
  });
};
