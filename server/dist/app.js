"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const socketIO = __importStar(require("socket.io"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const rooms_1 = require("./routes/rooms");
const user_1 = require("./routes/user");
const sockets_1 = require("./lib/sockets");
const state_1 = require("./state");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config({ path: ".env.development" });
    const app = (0, express_1.default)();
    const port = process.env["PORT"];
    const server = http_1.default.createServer(app);
    const io = new socketIO.Server(server, { cors: { origin: "*" } });
    const db = new db_1.DB();
    (0, state_1.setState)("io", io);
    (0, state_1.setState)("db", db);
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({ origin: "*" }));
    app.get("/", (_, res) => {
        res.json({ msg: "yacht-dice api" });
    });
    app.use("/rooms", rooms_1.roomsRouter);
    app.use("/user", user_1.userRouter);
    server.listen(port, () => {
        console.log(`[server] Server listening to port ${port}`);
    });
    io.on("connection", (socket) => {
        socket.on("command", sockets_1.handleCommand);
        socket.on("disconnect", () => (0, sockets_1.handleDisconnect)(socket));
    });
});
main().catch((e) => console.error(`main function error: ${e}`));
