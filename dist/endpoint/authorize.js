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
const express = require("express");
const ejs = require("ejs");
const models_1 = require("../models");
const oauth2_nodejs_1 = require("oauth2-nodejs");
const data_1 = require("../data");
const utils_1 = require("../utils");
const authorizeApp = express();
authorizeApp.get("/entry", (req, resp) => __awaiter(this, void 0, void 0, function* () {
    const request = new models_1.RequestWrapper(req);
    const authorizationEndpoint = new oauth2_nodejs_1.AuthorizationEndpoint();
    authorizationEndpoint.dataHandlerFactory = new data_1.CloudFirestoreDataHandlerFactory();
    authorizationEndpoint.allowedResponseTypes = ["code", "token"];
    try {
        const authorizationEndpointResponse = yield authorizationEndpoint.handleRequest(request);
        if (authorizationEndpointResponse.isSuccess()) {
            const authToken = {
                "client_id": request.getParameter("client_id"),
                "redirect_uri": request.getParameter("redirect_uri"),
                "response_type": request.getParameter("response_type"),
                "scope": request.getParameter("scope"),
                "created_at": Date.now()
            };
            const state = request.getParameter("state");
            if (state) {
                authToken["state"] = state;
            }
            const authTokenString = utils_1.Crypto.encrypt(JSON.stringify(authToken));
            utils_1.Navigation.redirect(resp, "/authentication/", { "auth_token": authTokenString });
        }
        else {
            const error = authorizationEndpointResponse.error;
            resp.set("Content-Type", "application/json; charset=UTF-8");
            resp.status(error.code).send(error.toJson());
        }
    }
    catch (e) {
        console.error(e);
        resp.status(500).send(e.toString());
    }
}));
authorizeApp.get("/consent", (req, resp) => __awaiter(this, void 0, void 0, function* () {
    const request = new models_1.RequestWrapper(req);
    const encryptedAuthToken = request.getParameter("auth_token");
    const authToken = JSON.parse(utils_1.Crypto.decrypt(encryptedAuthToken));
    const client = yield data_1.CloudFirestoreClients.fetch(authToken["client_id"]);
    const encryptedUserId = request.getParameter("user_id");
    const scopes = yield data_1.CloudFirestoreScopes.fetch();
    const consentViewTemplate = utils_1.Configuration.instance.view_consent_template;
    try {
        const template = yield consentViewTemplate.provide();
        const html = ejs.render(template, {
            scope: authToken["scope"],
            encryptedAuthToken,
            encryptedUserId,
            scopes,
            providerName: client["providerName"]
        });
        resp.status(200).send(html);
    }
    catch (e) {
        console.error(e);
        resp.status(500).send(e.toString());
    }
}));
authorizeApp.post("/consent", (req, resp) => __awaiter(this, void 0, void 0, function* () {
    const requestWrapper = new models_1.RequestWrapper(req);
    const encryptedAuthToken = requestWrapper.getParameter("auth_token");
    const authToken = JSON.parse(utils_1.Crypto.decrypt(encryptedAuthToken));
    const encryptedUserId = requestWrapper.getParameter("user_id");
    const userId = utils_1.Crypto.decrypt(encryptedUserId);
    const requestMap = new models_1.RequestMap();
    requestMap.setParameter("user_id", userId);
    requestMap.setParameter("state", authToken["state"]);
    requestMap.setParameter("client_id", authToken["client_id"]);
    requestMap.setParameter("redirect_uri", authToken["redirect_uri"]);
    requestMap.setParameter("response_type", authToken["response_type"]);
    requestMap.setParameter("scope", authToken["scope"]);
    const authorizationEndpoint = new oauth2_nodejs_1.AuthorizationEndpoint();
    authorizationEndpoint.dataHandlerFactory = new data_1.CloudFirestoreDataHandlerFactory();
    authorizationEndpoint.allowedResponseTypes = ["code", "token"];
    const action = requestWrapper.getParameter("action");
    if (action === "allow") {
        utils_1.Navigation.backTo(resp, yield authorizationEndpoint.allow(requestMap), authToken["redirect_uri"]);
    }
    else {
        utils_1.Navigation.backTo(resp, yield authorizationEndpoint.deny(requestMap), authToken["redirect_uri"]);
    }
}));
function authorize() {
    return functions.https.onRequest(authorizeApp);
}
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map