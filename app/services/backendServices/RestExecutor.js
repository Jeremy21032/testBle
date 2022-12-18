
export const postAzure = async (
    urlRequest,
    data,
    succuesFunction,
    errorFunction,
    
) => {



    // request options
    const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

        },
    };

    try {


        const response = await fetch(urlRequest, options);
        console.log("si hay response*----");
        let bodyResponse;

        try {
            bodyResponse = await response.json();

        } catch (e) {
            bodyResponse = undefined;
        }

        //console.log("bodyResponse first", bodyResponse);

        if (bodyResponse) {

            if (response.status == 200 || response.status == 201) {

                if (bodyResponse.success) {
                    console.log("------- RESPONDE EL serviciocon éxito----------", bodyResponse);
                    succuesFunction(bodyResponse)
                }else{
                    errorFunction(bodyResponse) 
                }
            } else {
                errorFunction(bodyResponse)
            }
        } else {
            errorFunction(null)
            console.log("no hay cuerpo del mensaje")
        }
    } catch (err) {
        console.log("error al hacer la consulta al postman", err)
        errorFunction(false)
    }
    return;
};