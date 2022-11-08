import { Router } from "express";
import type { DB } from "../db";
import { Yacht } from "../../../yacht/yacht";
import { Room } from "../../../yacht/types";
import { v4 } from "uuid";
import { getState } from "../state";
import type { Server } from "socket.io";

const router = Router();

router.get("/", async (_, res) => {
  const db: DB = getState("db");
  res.status(200).json({ rooms: db.rooms });
});

router.post("/new", (req, res) => {
  const io: Server = getState("io");
  const db: DB = getState("db");
  try {
    const { title, size } = req.body;
    const room = new Room(v4(), title, size);

    console.log(`[server] new roo ${room.id}`);

    db.rooms.push(room);
    io.sockets.emit("rooms", db.rooms);
    io.sockets.emit(room.id, room);
    res.status(200).json({ room });
  } catch (e) {
    res.status(500).json({ error: true, msg: e });
  }
});

router.post("/join", (req, res) => {
  const io: Server = getState("io");
  const db: DB = getState("db");
  try {
    const { player: playerId, roomId } = req.body;
    const room = db.rooms.find((r) => r.id === roomId);
    const player = db.getPlayerById(playerId);

    if (room === undefined) throw "wrong room id";
    if (player === undefined) throw "no player found";
    if (room.size === room.playerNum) throw "room is full";
    if (player.room) {
      const prevRoom = db.getRoomById(player.room)!;
      prevRoom.playerNum--;
    }

    player.room = room.id;
    room.playerNum++;

    if (room.playerNum === room.size) {
      room.game = new Yacht(db.getPlayersInRoom(room.id).map((p) => p.id));
      room.status = "playing";
    }
    console.log(room);

    io.sockets.emit(room.id, room);
    io.sockets.emit("rooms", db.rooms);
    res.status(200).json({ room });
  } catch (e) {
    res.status(500).json({ error: true, msg: e });
  }
});

router.post("/exit", (req, res) => {
  const io: Server = getState("io");
  const db: DB = getState("db");
  try {
    const { player: playerId } = req.body;
    const player = db.getPlayerById(playerId);

    if (player === undefined) throw "no player found";
    if (player.room === undefined) throw "player already has no room";

    const prevRoom = db.getRoomById(player.room)!;
    prevRoom.playerNum--;
    player.room = undefined;

    io.sockets.emit(prevRoom.id, prevRoom);
    io.sockets.emit("rooms", db.rooms);
    res.status(200).json({ room: prevRoom });
  } catch (e) {
    res.status(500).json({ error: true, msg: e });
  }
});

export { router as roomsRouter };
