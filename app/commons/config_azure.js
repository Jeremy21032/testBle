import { authorize } from "react-native-app-auth";

export const AD_config = {
  TENAN_ID: "660d74ab-52d0-4edd-b1b6-dfd40b692155",
  GRAND_TYPE: "DEFAULT",
  CLIENTE_ID: "774502e5-20ff-4d43-9a7b-ffc5a336275c",
  CLIENTE_SECRET: "aK~8Q~yYeaYudPFZ5zM8HRmQEqd1FABYWTt70c0R",
  SCOPES: "user.read openid profile offline_access",
  SCOPE_ARRAY: ["openid", "profile", "email", "offline_access"],
  ANDROID_REDIRECT_URI: "msauth://com.moderna/9DtNbHJctvXZStn4kYC3Bl5Uzio%3D",
  IOS_REDIRECT_URI: "msauth.com.moderna://auth",

  SIGNATURE_HASH: "9DtNbHJctvXZStn4kYC3Bl5Uzio=",
  ISSUER:
    "https://login.microsoftonline.com/660d74ab-52d0-4edd-b1b6-dfd40b692155/oauth2/v2.0/authorize",
};

export const msalAndroidConfig = {
  client_id: AD_config.CLIENTE_ID,
  authorization_user_agent: AD_config.GRAND_TYPE,
  redirect_uri: AD_config.ANDROID_REDIRECT_URI,
  authorities: [
    {
      type: "AAD",
      audience: {
        type: "AzureADMyOrg",
        tenant_id: AD_config.TENAN_ID,
      },
    },
  ],
};
export const msalIOSConfig = {
  client_id: AD_config.CLIENTE_ID,
  authorization_user_agent: AD_config.GRAND_TYPE,
  redirect_uri: AD_config.IOS_REDIRECT_URI,
  authorities: [
    {
      type: "AAD",
      audience: {
        type: "AzureADMyOrg",
        tenant_id: AD_config.TENAN_ID,
      },
    },
  ],
};
