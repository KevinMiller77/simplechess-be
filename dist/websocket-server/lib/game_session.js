"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chess_js_1 = require("chess.js");
class GameSession {
    constructor(id, player1, player2, whitePlayer, game = new chess_js_1.Chess()) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.whitePlayer = whitePlayer;
        this.game = game;
    }
    getGameId() {
        return this.id;
    }
    getPlayers() {
        return [this.player1, this.player2];
    }
    getOpponent(player) {
        if (player === this.player1) {
            return this.player2;
        }
        else if (player === this.player2) {
            return this.player1;
        }
        else {
            return null;
        }
    }
    isPlayer(player) {
        return player === this.player1 || player === this.player2;
    }
    isWhitePlayer(player) {
        return (player === this.player1 && this.whitePlayer) || (player === this.player2 && !this.whitePlayer);
    }
    makeMove(move) {
        this.game.move(move);
    }
    isGameOver() {
        return this.game.isCheckmate() || this.game.isDraw();
    }
    getFen() {
        return this.game.fen();
    }
}
exports.default = GameSession;
