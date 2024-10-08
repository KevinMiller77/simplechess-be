"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateConnection = migrateConnection;
exports.isInPool = isInPool;
exports.isInGame = isInGame;
exports.queuePlayer = queuePlayer;
exports.passMove = passMove;
exports.passResign = passResign;
const ws_1 = require("ws");
const game_client_1 = require("./game_client");
const crypto_1 = require("crypto");
const game_session_1 = __importDefault(require("./game_session"));
const enums_1 = require("../../common/enums");
// Create a new WebSocket server on port 8765
const wss = new ws_1.WebSocketServer({ port: 8765 });
const clients = [];
const waitingClients = [];
const ongoingGames = [];
function migrateConnection(newConnection) {
    const newConnectionUserId = newConnection.getUserId();
    for (const client of clients) {
        if (client.getSessionId() === newConnection.getSessionId()) {
            continue;
        }
        if (client.getUserId() === newConnectionUserId) {
            console.log(`Migrating connection for user ${newConnectionUserId}. New connection ID: ${newConnection.getSessionId()}, old connection ID: ${client.getSessionId()}`);
            client.migrate(newConnection);
            clients.splice(clients.indexOf(newConnection), 1);
            if (isInPool(newConnection)) {
                return new enums_1.ReconnectedMessage({
                    state: enums_1.ReconnectionState.IN_POOL,
                });
            }
            if (isInGame(newConnection)) {
                return new enums_1.ReconnectedMessage({
                    state: enums_1.ReconnectionState.IN_GAME,
                    fen: ongoingGames.find(game => game.getPlayers()[0] === newConnectionUserId || game.getPlayers()[1] === newConnectionUserId).getFen(),
                    color: ongoingGames.find(game => game.getPlayers()[0] === newConnectionUserId || game.getPlayers()[1] === newConnectionUserId).isWhitePlayer(newConnectionUserId) ? 'w' : 'b',
                });
            }
        }
    }
    return new enums_1.ReadyMessage();
}
function isInPool(client) {
    for (const waitingClient of waitingClients) {
        if (waitingClient.getUserId() === client.getUserId()) {
            return true;
        }
    }
    return false;
}
function isInGame(client) {
    for (const game of ongoingGames) {
        if (game.getPlayers().includes(client.getUserId())) {
            return true;
        }
    }
    return false;
}
function queuePlayer(client) {
    if (client.getUserId() === null) {
        console.log('Client is unidentified, will not add to pool');
        return;
    }
    if (isInPool(client)) {
        console.log(`Client ${client.getUserId()} is already in the queue`);
        return;
    }
    if (isInGame(client)) {
        console.log(`Client ${client.getUserId()} is already in a game`);
        return;
    }
    for (const queuedClient of waitingClients) {
        if (queuedClient.getUserId() === client.getUserId()) {
            console.log(`Client ${client.getUserId()} is already in the queue`);
            return;
        }
    }
    waitingClients.push(client);
    console.log(`Client ${client.getUserId()} has been added to the queue. Queue length: ${waitingClients.length}`);
    if (waitingClients.length >= 2) {
        const player1 = waitingClients.shift();
        const player2 = waitingClients.shift();
        const whitePlayer = (0, crypto_1.randomInt)(2) === 0;
        console.log('Starting new game, between: ', player1.getUserId(), player2.getUserId(), whitePlayer ? 'Player 1 White' : 'Player 1 Black');
        const game = new game_session_1.default((0, crypto_1.randomUUID)().toString(), player1.getUserId(), player2.getUserId(), whitePlayer);
        ongoingGames.push(game);
        player1.startGame(game);
        player2.startGame(game);
    }
}
function passMove(client, move) {
    const game = ongoingGames.find(game => game.getPlayers().includes(client.getUserId()));
    if (game) {
        const opponent = game.getOpponent(client.getUserId());
        try {
            game.makeMove(move);
        }
        catch (e) {
            console.log(`Invalid move: ${move}`);
            client.sendInvalidMove(game.getFen(), game.isWhitePlayer(client.getUserId()) ? 'w' : 'b');
            return;
        }
        const opponentClient = clients.find(client => client.getUserId() === opponent);
        console.log(`Passing move to opponent ${opponent}`);
        if (opponentClient) {
            opponentClient.sendMove(move);
        }
        if (game.isGameOver()) {
            ongoingGames.splice(ongoingGames.indexOf(game), 1);
        }
    }
}
function passResign(client) {
    const game = ongoingGames.find(game => game.getPlayers().includes(client.getUserId()));
    if (game) {
        const opponent = game.getOpponent(client.getUserId());
        const opponentClient = clients.find(client => client.getUserId() === opponent);
        console.log(`Resigning game for ${client.getUserId()}`);
        if (opponentClient) {
            opponentClient.sendResign();
        }
        ongoingGames.splice(ongoingGames.indexOf(game), 1);
    }
}
wss.on('connection', (ws) => {
    console.log('New client connected');
    const client = new game_client_1.ClientConnection(ws, (0, crypto_1.randomUUID)().toString());
    clients.push(client);
    // ws.onclose = () => {
    //   console.log('Client disconnected, deleting session in 5 seconds');
    //   setTimeout(() => {
    //     if (client) {
    //       console.log(`Deleting session ${client.getSessionId()}`);
    //       clients.splice(clients.indexOf(client), 1);
    //     }
    //   }, 5000);
    // }
});
console.log('WebSocket server is running on ws://localhost:8765');
