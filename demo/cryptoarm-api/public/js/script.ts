// @ts-ignore
import customProtocolCheck from "custom-protocol-check";

function someProtocol() {
    customProtocolCheck(
        "cryptoarm://params",
        () => {
            alert("Custom protocol not found.");
        },
        () => {
            alert("Custom protocol found and opened the file successfully.");
        },
        5000,
        () => {
            alert("Browser is not supported.");
        },
    )();
    return true;
}

export default someProtocol();
