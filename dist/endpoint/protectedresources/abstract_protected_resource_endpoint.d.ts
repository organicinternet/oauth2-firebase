import * as express from "express";
import * as functions from "firebase-functions";
import { ProtectedResourceEndpointResponse } from "oauth2-nodejs";
export declare abstract class AbstractProtectedResourceEndpoint {
    readonly endpoint: functions.HttpsFunction;
    protected abstract validateScope(scopes: string[]): boolean;
    protected abstract handleRequest(req: express.Request, endpointInfo: ProtectedResourceEndpointResponse): Promise<string>;
}
