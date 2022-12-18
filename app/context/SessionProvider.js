import React, { createContext, useState } from "react";

const SessionContext = createContext();

function SessionProvider({ children }) {
  const [session, setSession] = useState(true);
  const [sincronizado, setSincronizado] = useState(null);
  const [impresora,setImpresora]=useState(null);
  

  const toExport = {
    sessionUser: session,
    setSessionUser: setSession,
    sincronizado,
    setSincronizado,
    datosImpresora: impresora ,
    setImpresora
  };

  return (
    <SessionContext.Provider value={toExport}>
      {children}
    </SessionContext.Provider>
  );
}


export { SessionContext, SessionProvider };
