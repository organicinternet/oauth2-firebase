import { Request } from "oauth2-nodejs";
export declare class RequestMap implements Request {
    private _headerMap;
    private _parameterMap;
    constructor();
    getHeader(name: string): string | undefined;
    setHeader(name: string, value: string): void;
    getParameter(name: string): string | undefined;
    setParameter(name: string, value: string): void;
    getParameterMap(): Map<string, string>;
}
