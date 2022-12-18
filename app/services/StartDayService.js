import { START_DAY_TABLE } from "../commons/table_columns";

export const checkerStartDayInit = async(setIsNeewDay,userId) => {
    
    try {
        let dateNow = new Date();
        dateNow = dateNow.toISOString();
        let dateArray = dateNow.split("T");
        let startDayID = dateArray[0];
        startDayID=startDayID+"__"+userId;
        let query = "select * from " + START_DAY_TABLE.TABLE_NAME;
        console.log("query: " + query);
        global.dbModerna?.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (_, { rows: { _array } }) => {
                    console.log("datos de localdatabase start_day de ",_array)
                    if(_array.length>0){
                        let wasFounded=false;
                        for(let i=0;i<_array.length;i++){
                            if(_array[0].id_day==startDayID){
                                setIsNeewDay(_array[0].is_init);
                                wasFounded=true;
                            }
                        }
                        if(!wasFounded){
                            setIsNeewDay(false);
                        }
                        
                    }else{
                        setIsNeewDay(false);
                    }
                  
                },
                () => {
                    console.log("Error al consultar la tabla " + START_DAY_TABLE.TABLE_NAME);
                }
            );
        });
    } catch (e) {
        setIsNeewDay(false)
    }
    return;
};


export const insertNewStartDayInit = async(userId) => {
    
    try {
        let dateNow = new Date();
        dateNow = dateNow.toISOString();
        let dateArray = dateNow.split("T");
        let startDayID = dateArray[0];
        startDayID=startDayID+"__"+userId
        let query = `insert into ${START_DAY_TABLE.TABLE_NAME}(${START_DAY_TABLE.KEY_1},${START_DAY_TABLE.ITEM_2}) VALUES (?,?)` 
        console.log("query: " + query+startDayID);
        global.dbModerna?.transaction((tx) => {
            tx.executeSql(
                query,
                [startDayID,true],
                (_, { rows: { _array } }) => {
                    console.log("Se ejecuta insert new day correctamente" + START_DAY_TABLE.TABLE_NAME);
                    console.log(_array);

                },
                () => {
                    console.log("Error al consultar la tabla " + START_DAY_TABLE.TABLE_NAME);
                }
            );
        });
    } catch (e) {
        console.log("error al insertar el nuevo dia en catch")
    }
    return;

};

export const updateNewStartDayInit = async(isReadyAll,userId) => {
    
    try {
        let dateNow = new Date();
        dateNow = dateNow.toISOString();
        let dateArray = dateNow.split("T");
        let startDayID = dateArray[0];
        startDayID=startDayID+"__"+userId
        let query = `update ${START_DAY_TABLE.TABLE_NAME} set ${START_DAY_TABLE.ITEM_2}=${isReadyAll} where id_day='${startDayID}'` 
        console.log("query: " + query);
        global.dbModerna?.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (_, { rows: { _array } }) => {
                    console.log("Se ejecuta update new day correctamente" + START_DAY_TABLE.TABLE_NAME);
                    console.log(_array);

                },
                () => {
                    console.log("Error al actualizar la tabla " + START_DAY_TABLE.TABLE_NAME);
                }
            );
        });
    } catch (e) {
        console.log("error al actualizar el nuevo dia en catch")
    }
    return;

};
