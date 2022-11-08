import { useState } from "preact/hooks";
import { io } from "socket.io-client";
import { Start } from "./components/Start";
import { Lobby } from "./components/Lobby";
import { Game } from "./components/Game";

import { Player, Room } from "@yacht/types";
import { exitRoom, joinRoom, newPlayerByName } from "./lib/api";
import { SocketContext } from "./lib/context";

export function App() {
  const [player, setPlayer] = useState<Player>();
  const [room, setRoom] = useState<Room>();

  const socket = io("http://127.0.0.1:3000");

  const onPlayerFormSubmit = async (name: string) => {
    const newPlayer = await newPlayerByName(name);
    setPlayer(newPlayer);
  };

  const onJoin = async (roomId: string) => {
    if (!player) throw "player undefined";
    const newRoom = await joinRoom(player.id, roomId);
    setRoom(newRoom);
    setPlayer({ ...player, room: roomId });

    socket.on(roomId, (newRoom: Room) => {
      console.log(newRoom);
      setRoom(newRoom);
    });
  };

  const onExit = async () => {
    if (!player) throw "player undefined";
    await exitRoom(player.id);
    socket.off(player.room);
    setPlayer({ ...player, room: undefined });
  };

  return (
    <SocketContext.Provider value={socket}>
      <div className="w-screen h-screen flex justify-center">
        {!player && <Start onSubmit={onPlayerFormSubmit} />}
        {player && (!room || room.status !== "playing") && (
          <Lobby player={player} onExit={onExit} onJoin={onJoin} />
        )}
        {player && room && room.status === "playing" && (
          <Game player={player} room={room} />
        )}
      </div>
    </SocketContext.Provider>
  );
}
