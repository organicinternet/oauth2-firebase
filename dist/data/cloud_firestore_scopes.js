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
class CloudFirestoreScopes {
    static fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = admin.firestore();
            const snapshot = yield db.collection("scopes").get();
            const result = new Map();
            snapshot.forEach((doc) => {
                result.set(doc.get("name"), doc.get("description"));
            });
            return result;
        });
    }
}
exports.CloudFirestoreScopes = CloudFirestoreScopes;
//# sourceMappingURL=cloud_firestore_scopes.js.map