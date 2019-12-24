import { ClientCredentialFetcherProvider, GrantHandlerProvider } from "oauth2-nodejs";
export declare class CustomGrantHandlerProvider extends GrantHandlerProvider {
    constructor(clientCredentialFetcherProvider: ClientCredentialFetcherProvider);
}
