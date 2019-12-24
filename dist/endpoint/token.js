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
const models_1 = require("../models");
const granttype_1 = require("../granttype");
const data_1 = require("../data");
function token() {
    return functions.https.onRequest((req, resp) => __awaiter(this, void 0, void 0, function* () {
        if (req.method === "POST") {
            const request = new models_1.RequestWrapper(req);
            const tokenEndpoint = new oauth2_nodejs_1.TokenEndpoint();
            const clientCredentialFetcherProvider = new oauth2_nodejs_1.DefaultClientCredentialFetcherProvider();
            tokenEndpoint.grantHandlerProvider = new granttype_1.CustomGrantHandlerProvider(clientCredentialFetcherProvider);
            tokenEndpoint.clientCredentialFetcherProvider = clientCredentialFetcherProvider;
            tokenEndpoint.dataHandlerFactory = new data_1.CloudFirestoreDataHandlerFactory();
            try {
                const tokenEndpointResponse = yield tokenEndpoint.handleRequest(request);
                resp.set("Content-Type", "application/json; charset=UTF-8");
                resp.status(tokenEndpointResponse.code).send(tokenEndpointResponse.body);
            }
            catch (e) {
                console.error(e);
                resp.status(500).send(e.toString());
            }
        }
        else {
            resp.status(405).send("Method not allowed");
        }
    }));
}
exports.token = token;
//# sourceMappingURL=token.js.map