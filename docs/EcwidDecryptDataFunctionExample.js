var crypto = require("crypto");
var EncryptionHelper = (function () {
    function decryptText(cipher_alg, key, text, encoding) {
        var bText = Buffer.from(text, encoding);
        var iv = bText.slice(0, 16);
        var payload = bText.slice(16);
        var decipher = crypto.createDecipheriv(cipher_alg, key, iv);
        return Buffer.concat([
          decipher.update(payload, encoding),
          decipher.final()
        ]);
    }
    return {
        CIPHERS: {
          "AES_128": "aes128",          //requires 16 byte key
          "AES_128_CBC": "aes-128-cbc", //requires 16 byte key
          "AES_192": "aes192",          //requires 24 byte key
          "AES_256": "aes256"           //requires 32 byte key
        },
        decryptText: decryptText
    };
})();

module.exports = EncryptionHelper;

let client_secret = 'CLIENT SECRET';
let data = 'ECWID PAYLOAD'
let encryption_key = client_secret.substr(0, 16);
var originalBase64 = data.replace(/-/g, "+").replace(/_/g, "/");
var algorithm = encryptionHelper.CIPHERS.AES_128_CBC;
var decrypted = encryptionHelper.decryptText(algorithm, encryption_key, originalBase64, "base64");
var payloadObject = JSON.parse(decrypted)