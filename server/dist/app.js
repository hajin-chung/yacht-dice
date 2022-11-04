import dotenv from "dotenv";
import * as socketIO from "socket.io";
import express from "express";
import http from "http";
import PocketBase from "pocketbase";
import cors from "cors";
const main = async () => {
    dotenv.config({ path: ".env.development" });
    const app = express();
    const port = process.env.PORT;
    const server = http.createServer(app);
    const io = new socketIO.Server(server);
    const db = new PocketBase(process.env.DB);
    app.set("db", db);
    console.log(`[db] DB connected to ${process.env.DB}`);
    app.use(express.json());
    app.use(cors({ origin: "*" }));
    app.get("/", (req, res) => {
        res.json({ msg: "yacht-dice api" });
    });
    app.post("/new/user", async (req, res) => {
        const db = app.get("db");
        const { name } = req.body;
        try {
            console.log(name);
            if (name === undefined)
                throw "no username";
            const player = await db.records.create("players", {
                name,
                rating: 500,
            });
            res.status(200).json({ player });
        }
        catch (e) {
            res.status(500).json({ error: e });
        }
    });
    app.listen(port, () => {
        console.log(`[server] Server listening to port ${port}`);
    });
};
main().catch((e) => console.error(`main function error: ${e}`));
