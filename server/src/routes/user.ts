import { Router } from "express";
import { v4 } from "uuid";
import type { DB } from "../db";
import type { Player } from "../../../yacht/types";
import { getState } from "../state";

const router = Router();

router.post("/new", async (req, res) => {
  const db: DB = getState("db");
  const { name } = req.body;

  if (name == "") {
    res.status(500).json({ error: true, msg: "no username" });
    return;
  }

  const id = v4();
  const player: Player = { id, name };
  db.players.push(player);
  console.log(`[server] new user ${name}`);
  res.status(200).json({ player });
});

router.get("/room/:roomId", async (req, res) => {
  const db: DB = getState("db");
  const { roomId } = req.params;
  const players = db.getPlayersInRoom(roomId);
  res.status(200).json({ players });
});

export { router as userRouter };
