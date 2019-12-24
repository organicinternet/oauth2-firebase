"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const configuration_1 = require("./configuration");
class Crypto {
}
Crypto.encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(configuration_1.Configuration.instance.crypto_auth_token_secret_key_32, "ascii"), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};
Crypto.decrypt = (text) => {
    const divided = text.split(":");
    const iv = Buffer.from(divided.shift(), "hex");
    const encrypted = Buffer.from(divided.join(":"), "hex");
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(configuration_1.Configuration.instance.crypto_auth_token_secret_key_32, "ascii"), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
exports.Crypto = Crypto;
//# sourceMappingURL=crypto.js.map