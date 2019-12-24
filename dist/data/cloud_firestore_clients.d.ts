export declare class Client {
    private _clientId;
    private _providerName;
    private _scopes;
    private _responseTypes;
    private _grantTypes;
    private _userId;
    private _clientSecret;
    clientId: string;
    providerName: string;
    scopes: string[];
    responseTypes: string[];
    grantTypes: string[];
    userId: string;
    clientSecret: string;
}
export declare class CloudFirestoreClients {
    static fetch(clientId: string): Promise<Client | undefined>;
}
