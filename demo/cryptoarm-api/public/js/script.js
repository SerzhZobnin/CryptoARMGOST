(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "custom-protocol-check"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var custom_protocol_check_1 = require("custom-protocol-check");
    function someProtocol() {
        custom_protocol_check_1.default("cryptoarm://params", function () {
            alert("Custom protocol not found.");
        }, function () {
            alert("Custom protocol found and opened the file successfully.");
        }, 5000, function () {
            alert("Browser is not supported.");
        })();
        return true;
    }
    exports.default = someProtocol();
});
//# sourceMappingURL=script.js.map