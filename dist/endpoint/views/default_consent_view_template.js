"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class DefaultConsentViewTemplate {
    provide() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, "../../../views/consent.ejs"), "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
}
exports.DefaultConsentViewTemplate = DefaultConsentViewTemplate;
//# sourceMappingURL=default_consent_view_template.js.map