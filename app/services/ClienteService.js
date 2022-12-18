import { CLIENTES_TABLE_NAME } from "../commons/sqlite_config";
import { generateUIDD } from "../commons/utils";
import clientes from "./listaClientesTest";
import { db_insertCliente } from "./SqliteService";

const getClients = () => {
  return clientes;
};
const deleteClient = () => {};

const registerClient = (
  nombre,
  identificacion,
  direccion,
  telefono,
  sincronizado
) => {
  const id = generateUIDD();
  //clientes.push(client);
  db_insertCliente(
    id,
    nombre,
    identificacion,
    direccion,
    telefono,
    sincronizado
  );
  try {
    console.log("trying to sync");
  } catch {
    console.log("couldnt sync");
  }
  return id;
};

const searchClients = async (criteria, setClientes) => {
  console.log("criteria:" + criteria);
  let query = "select * from " + CLIENTES_TABLE_NAME;
  if (criteria !== "" && criteria !== undefined) {
    query +=
      " where nombre LIKE '%" +
      criteria +
      "%' OR identificacion LIKE '%" +
      criteria +
      "%'";
  }
  console.log("query: " + query);
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        setClientes(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + CLIENTES_TABLE_NAME);
      }
    );
  });
};
const findClientById = async (id, setCliente) => {
  let query =
    "select * from " + CLIENTES_TABLE_NAME + " where idCliente = '" + id + "';";
  console.log("query ", query);
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      query,
      [],
      (_, { rows: { _array } }) => {
        console.log("resultado consulta: ", _array);
        setCliente(_array[0]);
      },
      () => {
        console.log("Error al consultar la tabla " + CLIENTES_TABLE_NAME);
      }
    );
  });
};


const getUnsincronizedClients = (setClientes) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      "select * from " + CLIENTES_TABLE_NAME + " where sincronizado = 0;",
      [],
      (_, { rows: { _array } }) => {
        setClientes(_array);
      },
      () => {
        console.log("Error al consultar la tabla " + CLIENTES_TABLE_NAME);
      }
    );
  });
};

export const sincronizarCliente = (id, setClientes) => {
  global.dbModerna.transaction((tx) => {
    tx.executeSql(
      "update " +
        CLIENTES_TABLE_NAME +
        " set sincronizado = '1' where idCliente = '" +
        id +
        "';",
      [],
      () => {
        tx.executeSql(
          "select * from " + CLIENTES_TABLE_NAME + " where sincronizado = 0;",
          (_, { rows: { _array } }) => {
            setClientes(_array);
          }
        );
      },
      () => {
        console.log("Error al actualizar la tabla " + CLIENTES_TABLE_NAME);
      }
    );
  });
};

export {
  getClients,
  searchClients,
  getUnsincronizedClients,
  deleteClient,
  findClientById,
  registerClient,
};
