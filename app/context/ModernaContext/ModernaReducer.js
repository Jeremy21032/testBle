
import { CHANGE_IS_NEW_DAY, CHANGE_PRINTER_ADDRESS, CHANGE_PRINTER_ADDRESS_DEFAULT, LOAD_IS_AUTENTICATED, LOAD_SQL_DATA_USER, LOAD_USER_AZURE } from "./ModernaTypes";

export default function ModernaReducer(state, action) {
    const { payload, type } = action;

    switch (type) {
        case LOAD_USER_AZURE:
            return {
                ...state,
                azuerUser: payload,
            };
        case LOAD_IS_AUTENTICATED:
            return {
                ...state,
                isAutenticated: payload,
            };
        case CHANGE_PRINTER_ADDRESS:
            return {
                ...state,
                printerAddress: payload,

            };
        case CHANGE_PRINTER_ADDRESS_DEFAULT:
            return {
                ...state,
                printerAddressDefault: payload,

            }
        case LOAD_SQL_DATA_USER:
            return {
                ...state,
                userSql: payload,

            }
        case CHANGE_IS_NEW_DAY:
            return {
                ...state,
                isNewDay: payload,

            }


        default:
            return state;
    }
}
