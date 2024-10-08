"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConnection = void 0;
const ws_1 = __importDefault(require("ws"));
const utils_1 = require("../../common/utils");
const enums_1 = require("../../common/enums");
const server_1 = require("./server");
class ClientConnection {
    constructor(ws, sessionId) {
        this.ws = ws;
        this.sessionId = sessionId;
        this.handshaken = false;
        this.username = '';
        this.ws.on('message', this.onMessage.bind(this));
        // On connection, send a handshake request
        this.ws.send((0, utils_1.stringifyMessage)(new enums_1.HandshakeRequestMessage()));
    }
    migrate(newClient) {
        if (this.ws && this.ws.readyState === ws_1.default.OPEN) {
            this.ws.close();
        }
        this.ws = newClient.ws;
        this.ws.on('message', this.onMessage.bind(this));
    }
    onMessage(message) {
        const msg = (0, utils_1.parseMessage)(message);
        if (msg === undefined) {
            this.ws.send(JSON.stringify({
                type: enums_1.MessageTypeEnum.ERROR,
                data: 'Invalid message format'
            }));
            return;
        }
        // Ensure we don't receive a handshake message after the handshake
        if (msg.type === enums_1.MessageTypeEnum.HANDSHAKE) {
            const handshakeMessage = msg;
            if (this.handshaken) {
                console.log(`Client has already identified itself. Sending error. sessionId = ${this.sessionId}`);
                this.ws.send((0, utils_1.stringifyMessage)(new enums_1.ErrorMessage('Client has already identified itself')));
            }
            this.handshaken = true;
            this.username = handshakeMessage.data.username;
            const migrationResult = (0, server_1.migrateConnection)(this);
            if (migrationResult.type === enums_1.MessageTypeEnum.RECONNECTED) {
                console.log(`Client ${this.username} has reconnected. sessionId = ${this.sessionId}, status = `, migrationResult);
            }
            else {
                console.log(`Client ${this.username} has connected. sessionId = ${this.sessionId}`);
            }
            this.ws.send((0, utils_1.stringifyMessage)(migrationResult));
            return;
        }
        // Ensure we have a handshake before processing other messages
        if (!this.handshaken) {
            console.log(`Client has not yet identified itself. Requesting handshake again. sessionId = ${this.sessionId}`);
            this.ws.send((0, utils_1.stringifyMessage)(new enums_1.HandshakeRequestMessage()));
            return;
        }
        if (msg.type === enums_1.MessageTypeEnum.ECHO) {
            const echoMessage = msg;
            console.log(`Echoing message: ${echoMessage.data}. sessionId = ${this.sessionId}, username = ${this.username}`);
            this.ws.send((0, utils_1.stringifyMessage)(new enums_1.EchoMessage(echoMessage.data)));
            return;
        }
        if (msg.type === enums_1.MessageTypeEnum.ERROR) {
            const errorMessage = msg;
            console.log(`Received error message: ${errorMessage.data}. sessionId = ${this.sessionId}, username = ${this.username}`);
            return;
        }
        if (msg.type === enums_1.MessageTypeEnum.REQUEST_GAME) {
            (0, server_1.queuePlayer)(this);
            return;
        }
        if (msg.type === enums_1.MessageTypeEnum.MOVE) {
            console.log(`Received move message. sessionId = ${this.sessionId}, username = ${this.username}, move = `, msg.data);
            (0, server_1.passMove)(this, msg.data);
            return;
        }
        if (msg.type === enums_1.MessageTypeEnum.RESIGN) {
            console.log(`Received resign message. sessionId = ${this.sessionId}, username = ${this.username}`);
            (0, server_1.passResign)(this);
            return;
        }
    }
    startGame(gameSession) {
        const isWhite = gameSession.isWhitePlayer(this.username);
        console.log(`Starting game for ${this.username}. sessionId = ${this.sessionId}, color = ${isWhite ? 'w' : 'b'}`);
        this.ws.send((0, utils_1.stringifyMessage)({
            type: enums_1.MessageTypeEnum.START_GAME,
            data: {
                color: isWhite ? 'w' : 'b'
            }
        }));
    }
    sendMove(move) {
        this.ws.send((0, utils_1.stringifyMessage)({
            type: enums_1.MessageTypeEnum.MOVE,
            data: move
        }));
    }
    sendResign() {
        this.ws.send((0, utils_1.stringifyMessage)({
            type: enums_1.MessageTypeEnum.RESIGN,
            data: {}
        }));
    }
    sendInvalidMove(fen, color) {
        this.ws.send((0, utils_1.stringifyMessage)({
            type: enums_1.MessageTypeEnum.RECONNECTED,
            data: {
                state: enums_1.ReconnectionState.IN_GAME,
                fen,
                color
            }
        }));
    }
    getUserId() {
        return this.username;
    }
    getSessionId() {
        return this.sessionId;
    }
}
exports.ClientConnection = ClientConnection;
