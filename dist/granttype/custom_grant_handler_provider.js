"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth2_nodejs_1 = require("oauth2-nodejs");
class CustomGrantHandlerProvider extends oauth2_nodejs_1.GrantHandlerProvider {
    constructor(clientCredentialFetcherProvider) {
        super();
        const handlers = new Map();
        const authorizationCode = new oauth2_nodejs_1.AuthorizationCodeGrantHandler();
        authorizationCode.clientCredentialFetcherProvider = clientCredentialFetcherProvider;
        handlers.set("authorization_code", authorizationCode);
        const refreshToken = new oauth2_nodejs_1.RefreshTokenGrantHandler();
        refreshToken.clientCredentialFetcherProvider = clientCredentialFetcherProvider;
        handlers.set("refresh_token", refreshToken);
        const clientCredentials = new oauth2_nodejs_1.ClientCredentialsGrantHandler();
        clientCredentials.clientCredentialFetcherProvider = clientCredentialFetcherProvider;
        handlers.set("client_credentials", clientCredentials);
        this.handlers = handlers;
    }
}
exports.CustomGrantHandlerProvider = CustomGrantHandlerProvider;
//# sourceMappingURL=custom_grant_handler_provider.js.map