import { AD_config } from "../commons/config_azure";
import clientes from "./listaClientesTest";

const encodeFormData = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export const LoginAD = async (username, password) => {
  // // // // var request = new XMLHttpRequest();
  // // // // request.onreadystatechange = (e) => {
  // // // //   if (request.readyState !== 4) {
  // // // //     return;
  // // // //   }

  // // // //   if (request.status === 200) {
  // // // //     console.log("success", request.responseText);
  // // // //   } else {
  // // // //     console.warn("error");
  // // // //   }
  // // // // };
  // // // // request.open("GET", "https://pokeapi.co/api/v2/pokemon/ditto");
  // // // // request.send();
  // // // // return;

  const response = await fetch({
    method: "POST",
    url: `https://login.microsoftonline.com/${AD_config.TENAN_ID}/oauth2/v2.0/token`,
    headers: {
      headers: {
        "Content-Type": "application/x-www-form-url-encoded",
        Accept: "application/json",
      },
    },
    body: encodeFormData({
      grant_type: "password",
      client_id: AD_config.CLIENTE_ID,
      scope: AD_config.SCOPES,
      client_secret: AD_config.CLIENTE_SECRET,
      username,
      password,
    }),
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)));
  return response;
};
