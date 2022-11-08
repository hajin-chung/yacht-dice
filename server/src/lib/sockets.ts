import type { Socket } from "socket.io";
import type { DB } from "../db";
import type { CommandReturn, CommandWithRoomProps } from "../lib/types";
import { getState } from "../state";

export const handleCommand = (
  { roomId, ...command }: CommandWithRoomProps,
  callback: (res: CommandReturn) => void,
) => {
  console.log({ roomId, callback, command });
  const db: DB = getState("db");
  const io = getState("io");
  const room = db.rooms.find((r) => r.id === roomId);
  try {
    if (room === undefined) throw { error: true, msg: "wrong room id" };
    if (room.status === "waiting" || !room.game)
      throw { error: true, msg: "room is waiting for more players" };

    const res = room.game.command(command);
    callback(res);
    io.emit(roomId, room);
  } catch (e) {
    console.error(e);
    callback(<CommandReturn>e);
  }
};

export const handleDisconnect = (socket: Socket) => {
  // console.log(socket);
  socket;
};
