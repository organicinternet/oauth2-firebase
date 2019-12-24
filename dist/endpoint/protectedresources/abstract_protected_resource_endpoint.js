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
const oauth2_nodejs_1 = require("oauth2-nodejs");
const data_1 = require("../../data");
const models_1 = require("../../models");
const utils_1 = require("../../utils");
class AbstractProtectedResourceEndpoint {
    get endpoint() {
        return functions.https.onRequest((req, resp) => __awaiter(this, void 0, void 0, function* () {
            const request = new models_1.RequestWrapper(req);
            const protectedResourceEndpoint = new oauth2_nodejs_1.ProtectedResourceEndpoint();
            protectedResourceEndpoint.accessTokenFetcherProvider = new oauth2_nodejs_1.DefaultAccessTokenFetcherProvider();
            protectedResourceEndpoint.dataHandlerFactory = new data_1.CloudFirestoreDataHandlerFactory();
            const result = yield protectedResourceEndpoint.handleRequest(request);
            if (result.isSuccess()) {
                const endpointInfo = result.value;
                if (this.validateScope(endpointInfo.scope.split(" "))) {
                    resp.set("Content-Type", "application/json; charset=UTF-8");
                    try {
                        const responseBody = yield this.handleRequest(req, endpointInfo);
                        resp.status(200).send(responseBody);
                    }
                    catch (e) {
                        utils_1.Navigation.sendError(resp, new oauth2_nodejs_1.UnknownError(e.toString()));
                    }
                }
                else {
                    utils_1.Navigation.sendError(resp, new oauth2_nodejs_1.AccessDenied(""));
                }
            }
            else {
                utils_1.Navigation.sendError(resp, result.error);
            }
        }));
    }
}
exports.AbstractProtectedResourceEndpoint = AbstractProtectedResourceEndpoint;
//# sourceMappingURL=abstract_protected_resource_endpoint.js.map