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
const express = require("express");
const path = require("path");
const models_1 = require("../models");
const utils_1 = require("../utils");
class AuthenticationApp {
    static create(providerName) {
        const authenticationApp = express();
        authenticationApp.set("views", path.join(__dirname, "../../views"));
        authenticationApp.get("/", (req, resp) => {
            const request = new models_1.RequestWrapper(req);
            const authToken = request.getParameter("auth_token");
            resp.render("authentication.ejs", {
                authToken: authToken,
                projectId: process.env.GCLOUD_PROJECT,
                projectApiKey: utils_1.Configuration.instance.project_apikey,
                providerName: providerName
            });
        });
        authenticationApp.post("/", (req, resp) => __awaiter(this, void 0, void 0, function* () {
            const request = new models_1.RequestWrapper(req);
            const encryptedAuthToken = request.getParameter("auth_token");
            const idTokenString = request.getParameter("id_token");
            const success = request.getParameter("success");
            const error = request.getParameter("error");
            if (success === "true") {
                try {
                    const idToken = yield admin.auth().verifyIdToken(idTokenString);
                    if (idToken.aud === process.env.GCLOUD_PROJECT) {
                        const encryptedUserId = utils_1.Crypto.encrypt(idToken.sub);
                        utils_1.Navigation.redirect(resp, "/authorize/consent", { "auth_token": encryptedAuthToken, "user_id": encryptedUserId });
                    }
                }
                catch (e) {
                    console.log("e", e);
                }
            }
            else {
                console.log("error", error);
            }
            const authToken = JSON.parse(utils_1.Crypto.decrypt(request.getParameter("auth_token")));
            utils_1.Navigation.redirect(resp, authToken["redirect_uri"], { "error": "access_denied" });
        }));
        return authenticationApp;
    }
}
function googleAccountAuthentication() {
    return functions.https.onRequest(AuthenticationApp.create("Google"));
}
exports.googleAccountAuthentication = googleAccountAuthentication;
function facebookAccountAuthentication() {
    return functions.https.onRequest(AuthenticationApp.create("Facebook"));
}
exports.facebookAccountAuthentication = facebookAccountAuthentication;
function githubAccountAuthentication() {
    return functions.https.onRequest(AuthenticationApp.create("Github"));
}
exports.githubAccountAuthentication = githubAccountAuthentication;
function emailAccountAuthentication() {
    return functions.https.onRequest(AuthenticationApp.create("Email"));
}
exports.emailAccountAuthentication = emailAccountAuthentication;
//# sourceMappingURL=authentication.js.map