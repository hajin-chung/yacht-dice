import type { Socket } from "socket.io";
import type { DB } from "../db";
import type { CommandWithRoomProps } from "../lib/types";
import { getState } from "../state";

export const handleCommand = ({ roomId, ...command }: CommandWithRoomProps) => {
  const db: DB = getState("db");
  const io = getState("io");
  const room = db.rooms.find((r) => r.id === roomId);
  if (room === undefined) return { error: true, msg: "wrong room id" };
  if (room.status === "waiting" || !room.game)
    return { error: true, msg: "room is waiting for more players" };

  room.game.command(command);
  io.emit(roomId, room);
  return {};
};

export const handleDisconnect = (socket: Socket) => {};
