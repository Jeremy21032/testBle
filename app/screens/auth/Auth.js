import { authorize, prefetchConfiguration } from "react-native-app-auth";
import { AD_config } from "../../commons/config_azure";
import React, { useState } from "react";
import { View } from "react-native";
import StyledButton from "../../components/StyledButton";
import StyledText from "../../components/StyledText";

const config = {
  warmAndPrefetchChrome: true,
  issuer: AD_config.ISSUER,
  clientId: AD_config.CLIENTE_ID,
  redirectUrl: AD_config.ANDROID_REDIRECT_URI,
  scopes: AD_config.SCOPE_ARRAY,
};
//prefetchConfiguration(config);

export default function Auth() {
  const [session, setSession] = useState("");

  const login = async () => {
    try {
      const result = await authorize(config);
      setSession(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <StyledButton title="Login" onPress={login} />
      <StyledText>Session: {session}</StyledText>
    </View>
  );
}
