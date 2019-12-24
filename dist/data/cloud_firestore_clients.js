"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
class Client {
    get clientId() {
        return this._clientId;
    }
    set clientId(value) {
        this._clientId = value;
    }
    get providerName() {
        return this._providerName;
    }
    set providerName(value) {
        this._providerName = value;
    }
    get scopes() {
        return this._scopes;
    }
    set scopes(value) {
        this._scopes = value;
    }
    get responseTypes() {
        return this._responseTypes;
    }
    set responseTypes(value) {
        this._responseTypes = value;
    }
    get grantTypes() {
        return this._grantTypes;
    }
    set grantTypes(value) {
        this._grantTypes = value;
    }
    get userId() {
        return this._userId;
    }
    set userId(value) {
        this._userId = value;
    }
    get clientSecret() {
        return this._clientSecret;
    }
    set clientSecret(value) {
        this._clientSecret = value;
    }
}
exports.Client = Client;
class CloudFirestoreClients {
    static fetch(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const client = yield db.collection("clients").doc(clientId).get();
            if (client.exists) {
                const result = new Client();
                result.clientId = client.id;
                result.clientSecret = client.get("client_secret");
                result.grantTypes = Object.keys(client.get("grant_type")).filter((value) => { return client.get(`grant_type.${value}`); });
                result.responseTypes = Object.keys(client.get("response_type")).filter((value) => { return client.get(`response_type.${value}`); });
                result.scopes = Object.keys(client.get("scope")).filter((value) => { return client.get(`scope.${value}`); });
                result.userId = client.get("user_id");
                result.providerName = client.get("provider_name");
                return result;
            }
            else {
                return undefined;
            }
        });
    }
}
exports.CloudFirestoreClients = CloudFirestoreClients;
//# sourceMappingURL=cloud_firestore_clients.js.map