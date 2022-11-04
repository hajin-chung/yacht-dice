import dotenv from "dotenv";
import socketIO from "socket.io";
import express from "express";
import http from "http";
import PocketBase from "pocketbase";

const main = async () => {
  dotenv.config({ path: ".env.development"});

  const app = express();
  const port = process.env.PORT;

  const server = http.createServer(app);
  const io = new socketIO.Server(server);

  const db = new PocketBase(process.env.DB);

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ "msg": "yacht-dice api" });
  });

  app.post("/new/user", async (req, res) => {
    const {username} = req.body;
  });

  app.listen(port, () => {
    console.log(`[server]: Server listening to port ${port}`);
  });

}

main().catch(e => console.error(`main function error: ${e}`));