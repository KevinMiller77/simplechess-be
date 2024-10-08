"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = parseMessage;
exports.stringifyMessage = stringifyMessage;
function parseMessage(message) {
    try {
        return JSON.parse(message);
    }
    catch (e) {
        console.log(`Error parsing message: ${message}`);
        return undefined;
    }
}
function stringifyMessage(message) {
    return JSON.stringify(message);
}
