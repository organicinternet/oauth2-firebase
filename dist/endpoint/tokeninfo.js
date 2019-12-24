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
const data_1 = require("../data");
function tokeninfo() {
    return functions.https.onRequest((req, resp) => __awaiter(this, void 0, void 0, function* () {
        if (req.method === "GET") {
            const request = new models_1.RequestWrapper(req);
            const tokeninfoEndpoint = new oauth2_nodejs_1.TokeninfoEndpoint();
            tokeninfoEndpoint.dataHandlerFactory = new data_1.CloudFirestoreDataHandlerFactory();
            try {
                const tokeninfoEndpointResponse = yield tokeninfoEndpoint.handleRequest(request);
                resp.set("Content-Type", "application/json; charset=UTF-8");
                resp.status(tokeninfoEndpointResponse.code).send(tokeninfoEndpointResponse.body);
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
exports.tokeninfo = tokeninfo;
//# sourceMappingURL=tokeninfo.js.map