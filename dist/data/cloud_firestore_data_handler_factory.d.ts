import { DataHandler, DataHandlerFactory, Request } from "oauth2-nodejs";
export declare class CloudFirestoreDataHandlerFactory implements DataHandlerFactory {
    create(request: Request): DataHandler;
}
