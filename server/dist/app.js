"use strict";
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
const socket_io_1 = __importDefault(require("socket.io"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const pocketbase_1 = __importDefault(require("pocketbase"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    dotenv_1.default.config({ path: ".env.development" });
    const app = (0, express_1.default)();
    const port = process.env.PORT;
    const server = http_1.default.createServer(app);
    const io = new socket_io_1.default.Server(server);
    const db = new pocketbase_1.default(process.env.DB);
    app.use(express_1.default.json());
    app.get("/", (req, res) => {
        res.json({ "msg": "yacht-dice api" });
    });
    app.post("/new/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username } = req.body;
    }));
    app.listen(port, () => {
        console.log(`[server]: Server listening to port ${port}`);
    });
});
main().catch(e => console.error(`main function error: ${e}`));
