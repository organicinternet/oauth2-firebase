"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloud_firestore_data_handler_1 = require("./cloud_firestore_data_handler");
class CloudFirestoreDataHandlerFactory {
    create(request) {
        return new cloud_firestore_data_handler_1.CloudFirestoreDataHandler(request);
    }
}
exports.CloudFirestoreDataHandlerFactory = CloudFirestoreDataHandlerFactory;
//# sourceMappingURL=cloud_firestore_data_handler_factory.js.map