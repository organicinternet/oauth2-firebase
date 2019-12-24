"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url");
const querystring = require("querystring");
class Navigation {
    static redirect(resp, uri, parameters, fragments) {
        const targetUrl = url.parse(uri, true);
        if (parameters) {
            const query = targetUrl.query;
            Object.keys(parameters).forEach((key) => {
                const value = parameters[key];
                query[key] = typeof value === "string" ? value : String(value);
            });
        }
        if (fragments) {
            targetUrl.hash = `#${querystring.stringify(fragments)}`;
        }
        resp.redirect(url.format(targetUrl));
    }
    static backTo(resp, result, redirectUri) {
        if (result.isSuccess()) {
            const response = result.value;
            this.redirect(resp, redirectUri, response.query, response.fragment);
        }
        else {
            this.redirect(resp, redirectUri, { "error": result.error.getType() }, {});
        }
    }
    static sendError(resp, error) {
        resp.set("Content-Type", "application/json; charset=UTF-8");
        resp.status(error.code).send(error.toJson());
    }
}
exports.Navigation = Navigation;
//# sourceMappingURL=navigation.js.map