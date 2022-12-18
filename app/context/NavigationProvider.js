import React, { createContext, useState } from "react";

const NavigationContext = createContext();

function NavigationProvider({ children }) {
    const [activate, setActivate] = useState(false);
    const [statusImpresora, setStatusImpresora] = useState()
    const toExport = {
       setActivate,
       activate,
       statusImpresora,
       setStatusImpresora
    };

    return (
        <NavigationContext.Provider value={toExport}>
            {children}
        </NavigationContext.Provider>
    );
}


export { NavigationContext, NavigationProvider };
