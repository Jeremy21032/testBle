import { STOCK_TABLE_NAME } from "../commons/sqlite_config";
import { PRODUCTO_TABLE } from "../commons/table_columns";
import { postAzure } from "./backendServices/RestExecutor";
import { consultarProductos, productos } from "./ProductoService";

const stocks = [
  {
    idVendedor: 1,
    idProducto: productos[1].idSap,
    cantidad: 20,
    precioUnitario: 10,
    subTotal: 20 * 10,
  },
  {
    idVendedor: 1,
    idProducto: productos[2].idSap,
    cantidad: 30,
    precioUnitario: 10,
    subTotal: 30 * 10,
  },
];

export const getStockByIdProducto = (id, setStock) => {
  if (!id) {
    return;
  }
  let query =
    "select * from " + STOCK_TABLE_NAME + " WHERE idProducto = '" + id + "';";
  console.log("query stock: ", query);
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        //console.log("stocks query result: ", _array);
        setStock(_array[0]);
      },
      () => {
        console.log("Error al consultar la tabla " + STOCK_TABLE_NAME);
      }
    );
  });
};

export const getStockByIdProductoAzure = async(id, successFunctionChecker) => {
  
  await postAzure(
    "https://modernafunctions.azurewebsites.net/api/functionStock?code=f0GwnniSqttlOggL-9HMeMQlB3LRkZLCWm5JzEhgbH5LAzFuumO7Pw==",
    {
        "typeQuery": "R",
        "data": {
            "compare": [
                "id_producto_sap",
                id
            ]
        }
    },
    successFunctionChecker,
    ()=>{}
);
};
