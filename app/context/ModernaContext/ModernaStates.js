import React, {
    useCallback,
    useMemo,
    useReducer,
    useState,
    useRef,
    useEffect
} from "react";
import { StyleSheet } from "react-native";
import {GraphManager} from "../../azureConfig/graph/GraphManager"
import { createVendedorTable } from "../../commons/sqlite_config";
import { postAzure } from "../../services/backendServices/RestExecutor";
import { ConectarImpresora } from "../../services/ImpresoraService";
import { db_insertVendor, dropVendorLocalStorage, getVendorLocalStorage } from "../../services/VendedorService";
import ModernaContext from "./ModernaContext";
import ModernaReducer from "./ModernaReducer";
import { CHANGE_IS_NEW_DAY, CHANGE_PRINTER_ADDRESS, CHANGE_PRINTER_ADDRESS_DEFAULT, LOAD_IS_AUTENTICATED, LOAD_SQL_DATA_USER, LOAD_USER_AZURE } from "./ModernaTypes";
import { AuthManager } from "../../azureConfig/auth/AuthManager";


export default function ModernaStates({ children }) {
    const initialState = useMemo(
        () => ({
            azuerUser: null,
            isAutenticated: null,
            printerAddress: null,
            printerAddressDefault: null,
            userSql:null,
            isNewDay:true

        }),
        []
    );

    const [state, dispatch] = useReducer(ModernaReducer, initialState);
    useEffect(() => {
        ConectarImpresora(handlePrinterAddressDefault);
    }, [])
    const handleLoginAzure = useCallback(async () => {
        try {

            await AuthManager.signInAsync();
            await AuthManager.signInAsync();
            const token = await AuthManager.getAccessTokenAsync();

            console.log("token de inciios de session", token)
            if (token) {
                const user = await GraphManager.getUserAsync();
                console.log("user from azure", user)
                if (user) {

                    const successFunctionChecker = async (data) => {
                        if (data.data.dataBaseResult <= 0) {
                            await postAzure(
                                "https://modernafunctions.azurewebsites.net/api/functionSeller?code=g7Phy2p1NSgLiGhRa_pK9mo06pKe4RzqdwgfowyeHeLNAzFulVpZfQ==",
                                {

                                    "typeQuery": "I",
                                    "data": {
                                        "fieldType": [

                                            "nombre",
                                            "correo",
                                            "centro",
                                            "almacen",
                                            "codigo_prodiverso"
                                        ],
                                        "fieldData": [
                                            `'${user.displayName ? user.displayName : user.givenName}'`,
                                            `'${user.mail}'`,
                                            `'${"Moderna Alimentos S.A."}'`,
                                            `'${"Almacen Moderna Alimentos"}'`,
                                            `'${"123456789"}'`


                                        ]
                                    }

                                },
                                successFunctionInsert,
                                errorFunction
                            );


                        } else {
                            data.data.dataBaseResult["id"]=data.data.dataBaseResult[0].id_vendedor;
                            console.log("usuario ya almacenado en azure")
                            successFunctionInsert(data);
                        }
                        // thereIsUser=IsUser;
                    }
                    const successFunctionInsert = (bodyResponse) => {
                        try{
                            loadUserSql(bodyResponse.data.dataBaseResult.id);
                            console.log("bodyResponse---para localstorage",bodyResponse)
                            db_insertVendor(bodyResponse.data.dataBaseResult.id,
                                user.displayName ? user.displayName : user.givenName,
                                user.mail,
                                "Moderna Alimentos S.A.",
                                "Almacen Moderna Alimentos",
                                "123456789",
                                JSON.stringify(user))
                            dispatch({ type: LOAD_IS_AUTENTICATED, payload: true })
                            dispatch({ type: LOAD_USER_AZURE, payload: user })
                        }catch(e){
                            console.log("error ",e)
                        }
                       
                    }
                    const errorFunction = (data) => {
                        // thereIsUser=IsUser;
                        console.log("error al realizar la consulta", data)
                    }
                    await postAzure(
                        "https://modernafunctions.azurewebsites.net/api/functionSeller?code=g7Phy2p1NSgLiGhRa_pK9mo06pKe4RzqdwgfowyeHeLNAzFulVpZfQ==",
                        {
                            "typeQuery": "R",
                            "data": {
                                "compare": [
                                    "correo",
                                    `'${user.mail ? user.mail : user.userPrincipalName}'`
                                ]
                            }
                        },
                        successFunctionChecker,
                        errorFunction
                    );


                }


            }


        } catch (e) {
            console.log("error al inciiar sesión", e)
        }
    }, []);
    const handleLoutAzure = useCallback(async () => {
        try {

            await AuthManager.signOutAsync();
            dropVendorLocalStorage();
            setTimeout(createVendedorTable,2000)
            console.log("cerrando sesión")
        } catch (e) {
            console.log("error al cerrar sesión", e)

        } finally {
            dispatch({ type: LOAD_IS_AUTENTICATED, payload: false })
            dispatch({ type: LOAD_USER_AZURE, payload: null })
        }
    }, []);
    const loadUserSql = useCallback(async (user) => {
        try {
            dispatch({ type: LOAD_SQL_DATA_USER, payload: user })
           
        } catch (e) {
            console.log("error al cerrar sesión", e)

        } 
    }, []);
   const loadIsNewDay = useCallback(async (isNewDay) => {
        try {
            dispatch({ type: CHANGE_IS_NEW_DAY, payload: isNewDay })
           
        } catch (e) {
            console.log("error al  loadIsNewDay", e)

        } 
    }, []);
    
    const handleCurrentUserAutenticated = useCallback(async () => {
        try {
            const succesFunction=async(dataUserLocal)=>{
                console.log("checando user de local",dataUserLocal)
                if(dataUserLocal.length>0){
                    loadUserSql(dataUserLocal[0].id_vendedor);
                    console.log("usuario desde la base de datos local",dataUserLocal)
                    dispatch({ type: LOAD_IS_AUTENTICATED, payload: true })
                    dispatch({ type: LOAD_USER_AZURE, payload: JSON.parse(dataUserLocal[0].azure_user) })
                }else{
                    console.log("usuario desde la base de datos de azure")
                    const token = await AuthManager.getAccessTokenAsync();

                    console.log("token de inciios de session refresacado", token)
                    if (token) {
                        const user = await GraphManager.getUserAsync();
                        console.log("user from azure current", user)
                        if (user) {
                            
                            dispatch({ type: LOAD_IS_AUTENTICATED, payload: true })
                            dispatch({ type: LOAD_USER_AZURE, payload: user })
                        }
                    } else {
                        dispatch({ type: LOAD_IS_AUTENTICATED, payload: false })
                    }
        
                }
            }
             getVendorLocalStorage(succesFunction);

            //await AuthManager.signInAsync();
           

        } catch (e) {
            dispatch({ type: LOAD_IS_AUTENTICATED, payload: false })
            console.log("error al inciiar sesión", e)
        }
    }, []);




    const handlePrinterAddress = useCallback(async (addressPrinter) => {
        try {



            console.log("ip adres que llega del tooucs---------------", addressPrinter)

            dispatch({ type: CHANGE_PRINTER_ADDRESS, payload: addressPrinter })

        } catch (e) {
            console.log("error con el cambio de la impresora", e)
        }
    }, []);


    const handlePrinterAddressDefault = useCallback(async (addressPrinter) => {
        try {



            console.log("ip adres que llega del defaul---------------", addressPrinter)
            dispatch({ type: CHANGE_PRINTER_ADDRESS_DEFAULT, payload: addressPrinter })

        } catch (e) {
            console.log("error con el cambio de la impresora", e)
        }
    }, []);




    return (
        <ModernaContext.Provider
            value={{
                azuerUser: state.azuerUser,
                isAutenticated: state.isAutenticated,
                printerAddress: state.printerAddress,
                printerAddressDefault: state.printerAddressDefault,
                userSql:state.userSql,
                isNewDay:state.isNewDay,
                handleLoginAzure,
                loadIsNewDay,
                handleCurrentUserAutenticated,
                handleLoutAzure,
                handlePrinterAddress,
                handlePrinterAddressDefault

            }}
        >
            {children}

        </ModernaContext.Provider>
    );
}
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        marginTop: 22,
    },
    modalView: {
        backgroundColor: "white",
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        width: 320,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "justify",
    },
});
