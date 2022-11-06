import dotenv from "dotenv";
import * as socketIO from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import { DB } from "./db";

import { roomsRouter } from "./routes/rooms";
import { userRouter } from "./routes/user";
import { handleCommand, handleDisconnect } from "./lib/sockets";
import { setState } from "./state";

const main = async () => {
  dotenv.config({ path: ".env.development" });

  const app = express();
  const port = process.env["PORT"];

  const server = http.createServer(app);
  const io = new socketIO.Server(server, { cors: { origin: "*" } });
  const db = new DB();

  setState("io", io);
  setState("db", db);

  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.get("/", (_, res) => {
    res.json({ msg: "yacht-dice api" });
  });

  app.use("/rooms", roomsRouter);
  app.use("/user", userRouter);

  server.listen(port, () => {
    console.log(`[server] Server listening to port ${port}`);
  });

  io.on("connection", (socket) => {
    socket.on("command", handleCommand);
    socket.on("disconnect", () => handleDisconnect(socket));
  });
};

main().catch((e) => console.error(`main function error: ${e}`));
