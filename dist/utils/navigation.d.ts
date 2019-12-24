import * as express from "express";
import { AuthorizationEndpointResponse, OAuthError, Result } from "oauth2-nodejs";
export declare class Navigation {
    static redirect(resp: express.Response, uri: string, parameters?: {
        [key: string]: string | number;
    }, fragments?: {
        [key: string]: string | number;
    }): void;
    static backTo(resp: express.Response, result: Result<AuthorizationEndpointResponse>, redirectUri: string): void;
    static sendError(resp: express.Response, error: OAuthError): void;
}
