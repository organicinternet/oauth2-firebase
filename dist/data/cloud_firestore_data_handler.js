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
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const url = require("url");
const oauth2_nodejs_1 = require("oauth2-nodejs");
const utils_1 = require("../utils");
const secureRandomString = require("secure-random-string");
admin.initializeApp(functions.config().firebase);
class CloudFirestoreDataHandler {
    constructor(request) {
        this._request = request;
    }
    getRequest() {
        return this._request;
    }
    createOrUpdateAccessToken(authInfo, grantType) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const token = secureRandomString({ length: 128 });
            const expiresIn = utils_1.Configuration.instance.tokens_expires_in.get(grantType) || 86400;
            const createdOn = Date.now();
            const data = {
                auth_info_id: authInfo.id,
                token: token,
                expires_in: expiresIn,
                created_on: createdOn
            };
            yield db.collection("access_tokens").add(data);
            const result = new oauth2_nodejs_1.AccessToken();
            result.authId = authInfo.id;
            result.expiresIn = expiresIn;
            result.createdOn = createdOn;
            result.token = token;
            return result;
        });
    }
    createOrUpdateAuthInfo(clientId, userId, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Check the scope
            const db = admin.firestore();
            let queryRef = db.collection("auth_infos").where("client_id", "==", clientId).where("user_id", "==", userId);
            if (scope) {
                scope.split(" ").forEach(s => {
                    queryRef = queryRef.where(`scope.${s}`, "==", true);
                });
            }
            const snapshot = yield queryRef.get();
            const code = secureRandomString({ length: 64 });
            if (snapshot.empty) {
                const refreshToken = secureRandomString();
                const data = {
                    user_id: userId,
                    client_id: clientId,
                    scope: scope ? scope.split(" ").reduce((a, c) => { a[c] = true; return a; }, {}) : {},
                    refresh_token: refreshToken,
                    code: code
                };
                const authInfoRef = yield db.collection("auth_infos").add(data);
                const result = new oauth2_nodejs_1.AuthInfo();
                result.id = authInfoRef.id;
                result.userId = userId;
                result.clientId = clientId;
                result.refreshToken = refreshToken;
                result.code = code;
                if (scope) {
                    result.scope = scope;
                }
                return result;
            }
            else {
                // TODO: Check the size of the docs
                const authInfo = snapshot.docs[0];
                yield db.collection("auth_infos").doc(authInfo.id).update({
                    code: code
                });
                const result = new oauth2_nodejs_1.AuthInfo();
                result.id = authInfo.id;
                result.userId = authInfo.get("user_id");
                result.clientId = authInfo.get("client_id");
                result.refreshToken = authInfo.get("refresh_token");
                result.code = code;
                const scopes = Object.keys(authInfo.get("scope"));
                if (scopes.length > 0) {
                    result.scope = scopes.join(" ");
                }
                return result;
            }
        });
    }
    findAuthInfo(fieldName, fieldValue) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const queryRef = db.collection("auth_infos").where(fieldName, "==", fieldValue);
            const snapshot = yield queryRef.get();
            if (snapshot.empty) {
                return undefined;
            }
            else {
                // TODO: Check the size of the docs
                const authInfo = snapshot.docs[0];
                return this.convertAuthInfo(authInfo);
            }
        });
    }
    convertAuthInfo(authInfo) {
        const result = new oauth2_nodejs_1.AuthInfo();
        result.id = authInfo.id;
        result.userId = authInfo.get("user_id");
        result.clientId = authInfo.get("client_id");
        result.refreshToken = authInfo.get("refresh_token");
        const scopes = Object.keys(authInfo.get("scope"));
        if (scopes.length > 0) {
            result.scope = scopes.join(" ");
        }
        return result;
    }
    getClientUserId(clientId, clientSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const client = yield db.collection("clients").doc(clientId).get();
            if (client.exists) {
                return client.get("user_id");
            }
            return undefined;
        });
    }
    validateClient(clientId, clientSecret, grantType) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const client = yield db.collection("clients").doc(clientId).get();
            if (client.exists) {
                // TODO: Check the client status and/or etc.
                return client.get(`grant_type.${grantType}`) && client.get("client_secret") === clientSecret;
            }
            return false;
        });
    }
    validateClientById(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const client = yield db.collection("clients").doc(clientId).get();
            if (client.exists) {
                // TODO: Check the client status and/or etc.
                return true;
            }
            return false;
        });
    }
    validateClientForAuthorization(clientId, responseType) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const client = yield db.collection("clients").doc(clientId).get();
            if (client.exists) {
                return responseType.split(" ").every((value) => {
                    return client.get(`response_type.${value}`);
                });
            }
            return false;
        });
    }
    validateRedirectUri(clientId, redirectUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const client = yield db.collection("clients").doc(clientId).get();
            if (client.exists) {
                const registeredRedirectUri = client.get("redirect_uri");
                const validRedirectUrl = url.parse(registeredRedirectUri);
                const redirectUrl = url.parse(redirectUri);
                return (validRedirectUrl.protocol === redirectUrl.protocol) &&
                    (validRedirectUrl.host === redirectUrl.host) &&
                    (validRedirectUrl.pathname === redirectUrl.pathname);
            }
            return false;
        });
    }
    validateScope(clientId, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (scope) {
                const db = admin.firestore();
                const client = yield db.collection("clients").doc(clientId).get();
                if (client.exists) {
                    return client.get(`scope.${scope}`);
                }
                return false;
            }
            else {
                return false;
            }
        });
    }
    getAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const queryRef = yield db.collection("access_tokens").where("token", "==", token);
            const snapshot = yield queryRef.get();
            if (snapshot.empty) {
                return undefined;
            }
            else {
                // TODO: Check the size of the docs
                const accessToken = snapshot.docs[0];
                const result = new oauth2_nodejs_1.AccessToken();
                result.authId = accessToken.get("auth_info_id");
                result.expiresIn = accessToken.get("expires_in");
                result.createdOn = accessToken.get("created_on");
                result.token = accessToken.get("token");
                return result;
            }
        });
    }
    getAuthInfoByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAuthInfo("refresh_token", refreshToken);
        });
    }
    getAuthInfoByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findAuthInfo("code", code);
        });
    }
    getAuthInfoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const authInfo = yield db.collection("auth_infos").doc(id).get();
            if (authInfo.exists) {
                return this.convertAuthInfo(authInfo);
            }
            else {
                return undefined;
            }
        });
    }
    validateUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = admin.auth();
            try {
                const user = yield auth.getUser(userId);
                if (user) {
                    return true;
                }
            }
            catch (e) {
                console.log("e", e);
            }
            return false;
        });
    }
    getUserId(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not implemented");
        });
    }
}
exports.CloudFirestoreDataHandler = CloudFirestoreDataHandler;
//# sourceMappingURL=cloud_firestore_data_handler.js.map