import { VENDEDOR_TABLE } from "../commons/table_columns";

const VENDOR_TABLE_NAME="vendedor";
export const db_insertVendor = (
    id,
    nombre,
    correo,
    centro,
    almacen,
    codigo_prodiverso,
    userAzure
  ) => {
    global.dbModerna.transaction((tx) => {
      tx.executeSql(
        `insert into vendedor(id_vendedor,nombre,correo,centro,almacen,codigo_prodiverso,azure_user) values (?,?,?,?,?,?,?);`,
        [id, nombre, correo, centro, almacen, codigo_prodiverso,userAzure],
        () => {
          tx.executeSql(
            "select * from vendedor",
            [],
            (_, { rows: { _array } }) => {
             // console.log("Arreglo", _array);
            },
            () => {
              console.log("Error al insertar la tabla y");
            }
          );
          console.log(
            "se ejecuta sentencia insert vendedor OK  "
          );
        },
        () => {
          console.log("error al insertar tabla vendedor");
        }
      );
    });
  };


  export const getVendorLocalStorage = (succesFunction) => {
    global.dbModerna.transaction((tx) => {
      tx.executeSql(
        "select * from " + VENDOR_TABLE_NAME + "",
        [],
        (_, { rows: { _array } }) => {
            succesFunction(_array);
        },
        () => {
          console.log("Error al consultar la tabla " + VENDOR_TABLE_NAME);
        }
      );
    });
  };

  export const dropVendorLocalStorage = () => {
    global.dbModerna.transaction((tx) => {
      tx.executeSql(
        "drop table " + VENDOR_TABLE_NAME + "",
        [],
        (_, { rows: { _array } }) => {
           // succesFunction(_array);
        },
        () => {
          console.log("Error al consultar la tabla " + VENDOR_TABLE_NAME);
        }
      );
    });
  };