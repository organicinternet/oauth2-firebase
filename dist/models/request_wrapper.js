"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestWrapper {
    constructor(original) {
        this._original = original;
    }
    getHeader(name) {
        return this._original.get(name) || "";
    }
    getParameter(name) {
        return this._original.query[name] || this._original.body[name];
    }
    getParameterMap() {
        const result = new Map();
        for (const key in this._original.query) {
            if (this._original.body.hasOwnProperty(key)) {
                result.set(key, this._original.query[key]);
            }
        }
        for (const key in this._original.body) {
            if (this._original.body.hasOwnProperty(key)) {
                result.set(key, this._original.body[key]);
            }
        }
        return result;
    }
}
exports.RequestWrapper = RequestWrapper;
//# sourceMappingURL=request_wrapper.js.map