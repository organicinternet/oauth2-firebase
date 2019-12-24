"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const default_consent_view_template_1 = require("../endpoint/views/default_consent_view_template");
class Configuration {
    constructor() {
    }
    static get instance() {
        if (this._instance == undefined) {
            this._instance = new Configuration();
        }
        return this._instance;
    }
    static init(params) {
        this.instance._crypto_auth_token_secret_key_32 = params.crypto_auth_token_secret_key_32;
        this.instance._project_apikey = params.project_api_key;
        this.instance._view_consent_template = params.views_consent_template;
        this.instance._tokens_expires_in = params.tokens_expires_in;
    }
    get crypto_auth_token_secret_key_32() {
        if (this._crypto_auth_token_secret_key_32) {
            return this._crypto_auth_token_secret_key_32;
        }
        else {
            throw new Error("crypto_auth_token_secret_key_32 not set");
        }
    }
    get project_apikey() {
        if (this._project_apikey) {
            return this._project_apikey;
        }
        else {
            throw new Error("project_api_key not set");
        }
    }
    get view_consent_template() {
        if (this._view_consent_template) {
            return this._view_consent_template;
        }
        else {
            return new default_consent_view_template_1.DefaultConsentViewTemplate();
        }
    }
    get tokens_expires_in() {
        if (this._tokens_expires_in) {
            return this._tokens_expires_in;
        }
        else {
            const result = new Map();
            result.set("authorization_code", 86400);
            result.set("implicit", 3600);
            result.set("password", 86400);
            result.set("client_credentials", 86400);
            result.set("refresh_token", 86400);
            return result;
        }
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=configuration.js.map