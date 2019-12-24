"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const abstract_protected_resource_endpoint_1 = require("./abstract_protected_resource_endpoint");
class UserinfoEndpoint extends abstract_protected_resource_endpoint_1.AbstractProtectedResourceEndpoint {
    handleRequest(req, endpointInfo) {
        return new Promise((resolve, reject) => {
            const auth = admin.auth();
            auth.getUser(endpointInfo.userId).then((userRecord) => {
                resolve(JSON.stringify({ "sub": endpointInfo.userId, "name": userRecord.displayName }));
            }).catch(e => {
                reject(e);
            });
        });
    }
    validateScope(scopes) {
        return scopes.indexOf("profile") !== -1;
    }
}
exports.UserinfoEndpoint = UserinfoEndpoint;
function userinfo() {
    return new UserinfoEndpoint().endpoint;
}
exports.userinfo = userinfo;
//# sourceMappingURL=userinfo.js.map