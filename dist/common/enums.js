"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResignMessage = exports.DeclineDrawMessage = exports.AcceptDrawMessage = exports.OfferDrawMessage = exports.MoveMessage = exports.StartGameMessage = exports.JoinGameQueueMessage = exports.ErrorMessage = exports.EchoMessage = exports.ReconnectedMessage = exports.ReadyMessage = exports.HandshakeMessage = exports.HandshakeRequestMessage = exports.ReconnectionState = exports.MessageTypeEnum = void 0;
var MessageTypeEnum;
(function (MessageTypeEnum) {
    MessageTypeEnum["HANDSHAKE_REQUEST"] = "HANDSHAKE_REQUEST";
    MessageTypeEnum["HANDSHAKE"] = "HANDSHAKE";
    MessageTypeEnum["READY"] = "READY";
    MessageTypeEnum["RECONNECTED"] = "RECONNECTED";
    MessageTypeEnum["ECHO"] = "ECHO";
    MessageTypeEnum["ERROR"] = "ERROR";
    MessageTypeEnum["REQUEST_GAME"] = "REQUEST_GAME";
    MessageTypeEnum["START_GAME"] = "START_GAME";
    MessageTypeEnum["MOVE"] = "MOVE";
    MessageTypeEnum["OFFER_DRAW"] = "OFFER_DRAW";
    MessageTypeEnum["ACCEPT_DRAW"] = "ACCEPT_DRAW";
    MessageTypeEnum["DECLINE_DRAW"] = "DECLINE_DRAW";
    MessageTypeEnum["RESIGN"] = "RESIGN";
})(MessageTypeEnum || (exports.MessageTypeEnum = MessageTypeEnum = {}));
var ReconnectionState;
(function (ReconnectionState) {
    ReconnectionState["IN_POOL"] = "IN_POOL";
    ReconnectionState["IN_GAME"] = "IN_GAME";
})(ReconnectionState || (exports.ReconnectionState = ReconnectionState = {}));
class HandshakeRequestMessage {
    constructor() {
        this.type = MessageTypeEnum.HANDSHAKE_REQUEST;
        this.data = {};
    }
}
exports.HandshakeRequestMessage = HandshakeRequestMessage;
class HandshakeMessage {
    constructor(username) {
        this.type = MessageTypeEnum.HANDSHAKE;
        this.data = { username };
    }
}
exports.HandshakeMessage = HandshakeMessage;
class ReadyMessage {
    constructor() {
        this.type = MessageTypeEnum.READY;
        this.data = {};
    }
}
exports.ReadyMessage = ReadyMessage;
class ReconnectedMessage {
    constructor(data) {
        this.type = MessageTypeEnum.RECONNECTED;
        this.data = data;
    }
}
exports.ReconnectedMessage = ReconnectedMessage;
class EchoMessage {
    constructor(data) {
        this.type = MessageTypeEnum.ECHO;
        this.data = data;
    }
}
exports.EchoMessage = EchoMessage;
class ErrorMessage {
    constructor(error) {
        this.type = MessageTypeEnum.ERROR;
        this.data = error;
    }
}
exports.ErrorMessage = ErrorMessage;
class JoinGameQueueMessage {
    constructor() {
        this.type = MessageTypeEnum.REQUEST_GAME;
        this.data = {};
    }
}
exports.JoinGameQueueMessage = JoinGameQueueMessage;
class StartGameMessage {
    constructor(color) {
        this.type = MessageTypeEnum.START_GAME;
        this.data = { color };
    }
}
exports.StartGameMessage = StartGameMessage;
class MoveMessage {
    constructor(move) {
        this.type = MessageTypeEnum.MOVE;
        this.data = move;
    }
}
exports.MoveMessage = MoveMessage;
class OfferDrawMessage {
    constructor() {
        this.type = MessageTypeEnum.OFFER_DRAW;
        this.data = {};
    }
}
exports.OfferDrawMessage = OfferDrawMessage;
class AcceptDrawMessage {
    constructor() {
        this.type = MessageTypeEnum.ACCEPT_DRAW;
        this.data = {};
    }
}
exports.AcceptDrawMessage = AcceptDrawMessage;
class DeclineDrawMessage {
    constructor() {
        this.type = MessageTypeEnum.DECLINE_DRAW;
        this.data = {};
    }
}
exports.DeclineDrawMessage = DeclineDrawMessage;
class ResignMessage {
    constructor() {
        this.type = MessageTypeEnum.RESIGN;
        this.data = {};
    }
}
exports.ResignMessage = ResignMessage;
