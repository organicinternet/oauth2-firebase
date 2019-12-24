import { Request } from "oauth2-nodejs";
import * as express from "express";
export declare class RequestWrapper implements Request {
    private _original;
    constructor(original: express.Request);
    getHeader(name: string): string;
    getParameter(name: string): string | undefined;
    getParameterMap(): Map<string, string>;
}
