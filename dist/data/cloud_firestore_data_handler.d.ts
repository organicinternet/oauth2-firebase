import { AccessToken, AuthInfo, DataHandler, Request } from "oauth2-nodejs";
export declare class CloudFirestoreDataHandler implements DataHandler {
    private _request;
    constructor(request: Request);
    getRequest(): Request;
    createOrUpdateAccessToken(authInfo: AuthInfo, grantType: string): Promise<AccessToken | undefined>;
    createOrUpdateAuthInfo(clientId: string, userId: string, scope?: string): Promise<AuthInfo | undefined>;
    private findAuthInfo;
    private convertAuthInfo;
    getClientUserId(clientId: string, clientSecret: string): Promise<string | undefined>;
    validateClient(clientId: string, clientSecret: string, grantType: string): Promise<boolean>;
    validateClientById(clientId: string): Promise<boolean>;
    validateClientForAuthorization(clientId: string, responseType: string): Promise<boolean>;
    validateRedirectUri(clientId: string, redirectUri: string): Promise<boolean>;
    validateScope(clientId: string, scope?: string): Promise<boolean>;
    getAccessToken(token: string): Promise<AccessToken | undefined>;
    getAuthInfoByRefreshToken(refreshToken: string): Promise<AuthInfo | undefined>;
    getAuthInfoByCode(code: string): Promise<AuthInfo | undefined>;
    getAuthInfoById(id: string): Promise<AuthInfo | undefined>;
    validateUserById(userId: string): Promise<boolean>;
    getUserId(username: string, password: string): Promise<string | undefined>;
}
