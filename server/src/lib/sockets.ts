import type { Socket } from "socket.io";
import type { DB } from "../db";
import type { CommandWithRoomProps } from "../lib/types";
import type { CommandReturn } from "../../../yacht/yacht";
import { getState } from "../state";

export const handleCommand = (
  { roomId, ...command }: CommandWithRoomProps,
  callback: (res: CommandReturn) => void,
) => {
  console.log(`[server] command ${command.command} to ${roomId}`);
  console.log("[server] command content: ", command.content);
  const db: DB = getState("db");
  const io = getState("io");
  const roomIdx = db.rooms.findIndex((r) => r.id === roomId);
  const room = db.rooms[roomIdx];
  try {
    if (room === undefined) throw { error: true, msg: "wrong room id" };
    if (room.status === "waiting" || !room.game)
      throw { error: true, msg: "room is waiting for more players" };

    const res = room.game.command(command);
    callback(res);
    if (room.game.isEnded) {
      room.status = "done";
      db.rooms.splice(roomIdx, 1);
    }

    io.emit(roomId, room);
  } catch (e) {
    console.error(e);
    callback(<CommandReturn>e);
  }
};

export const handleDisconnect = (socket: Socket) => {
  socket;
};
