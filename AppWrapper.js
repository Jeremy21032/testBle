import React, { useEffect } from "react";
import App from "./App";
import { NavigationProvider } from "./app/context/NavigationProvider";

import { load_db_config } from "./app/commons/sqlite_config";

import { PedidoProvider } from "./app/context/PedidoContext";
import { SessionProvider } from "./app/context/SessionProvider";

export default function AppWrapper() {
  useEffect(() => {
   load_db_config();
  }, []);

  return (
    <SessionProvider>
      <NavigationProvider>
        <PedidoProvider>
          <App />
        </PedidoProvider>
      </NavigationProvider>
    </SessionProvider>
  );
}
