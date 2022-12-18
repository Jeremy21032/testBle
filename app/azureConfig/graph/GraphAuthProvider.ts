// Copyright (c) Microsoft.
// Licensed under the MIT license.

import { AuthManager } from "../auth/AuthManager";

// <AuthProviderSnippet>

// Used by Graph client to get access tokens
// See https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/dev/docs/CustomAuthenticationProvider.md
export class GraphAuthProvider {
  getAccessToken = async () => {
    const token = await AuthManager.getAccessTokenAsync();
    console.log("token de inciios de session 123",token)
    return token || '';
  };
}
// </AuthProviderSnippet>
