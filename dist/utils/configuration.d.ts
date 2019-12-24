import { ConsentViewTemplate } from "../endpoint/views/consent_view_template";
export interface ConfigurationParameters {
    crypto_auth_token_secret_key_32: string;
    project_api_key: string;
    views_authentication_path?: string;
    views_consent_template?: ConsentViewTemplate;
    tokens_expires_in?: Map<string, number>;
}
export declare class Configuration {
    private static _instance;
    private _crypto_auth_token_secret_key_32;
    private _project_apikey;
    private _view_consent_template;
    private _tokens_expires_in;
    private constructor();
    static readonly instance: Configuration;
    static init(params: ConfigurationParameters): void;
    readonly crypto_auth_token_secret_key_32: string;
    readonly project_apikey: string;
    readonly view_consent_template: ConsentViewTemplate;
    readonly tokens_expires_in: Map<string, number>;
}
