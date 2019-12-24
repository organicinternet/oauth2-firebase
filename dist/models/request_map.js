"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestMap {
    constructor() {
        this._headerMap = new Map();
        this._parameterMap = new Map();
    }
    getHeader(name) {
        return this._headerMap.get(name);
    }
    setHeader(name, value) {
        this._headerMap.set(name, value);
    }
    getParameter(name) {
        return this._parameterMap.get(name);
    }
    setParameter(name, value) {
        this._parameterMap.set(name, value);
    }
    getParameterMap() {
        return this._parameterMap;
    }
}
exports.RequestMap = RequestMap;
//# sourceMappingURL=request_map.js.map