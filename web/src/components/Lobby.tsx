import { Player, Room } from "@yacht/types";
import { useContext, useEffect, useState } from "preact/hooks";
import { getRooms, createRoom } from "../lib/api";
import { SocketContext } from "../lib/context";

type LobbyProps = {
  player: Player;
  onJoin: (roomId: string) => Promise<void>;
  onExit: () => Promise<void>;
};

export const Lobby = ({ player, onJoin, onExit }: LobbyProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchRooms = async () => {
      const existingRooms = await getRooms();
      setRooms(existingRooms);
    };

    fetchRooms().catch((err) => console.error(err));

    socket.on("rooms", (rooms: Room[]) => {
      setRooms(rooms);
    });

    return () => {
      socket.off("rooms");
    };
  }, []);

  const onNewRoom = async (title: string, size: number) => {
    await createRoom(title, size);
  };

  return (
    <div className="flex flex-col w-[600px]">
      <div className="h-8" />
      <div className="flex justify-between">
        <h1 className="font-bold text-4xl">Lobby</h1>
        <div className="flex flex-col items-end">
          <span className="font-bold">{player.name}</span>
          <span className="text-xs text-gray-400">{player.id}</span>
        </div>
      </div>
      <div className="h-2" />
      <NewRoomForm onSubmit={onNewRoom} />
      <div className="h-2" />
      <RoomList
        rooms={rooms}
        onJoin={onJoin}
        onExit={onExit}
        currentRoomId={player.room!}
      />
    </div>
  );
};

type RoomListProps = {
  rooms: Room[];
  onJoin: (roomId: string) => Promise<void>;
  onExit: () => Promise<void>;
  currentRoomId: string;
};

const RoomList = ({ rooms, onJoin, onExit, currentRoomId }: RoomListProps) => {
  const currentRoom = rooms.find((r) => r.id === currentRoomId);

  return (
    <div className="flex flex-col gap-1">
      {currentRoom && (
        <div
          key={currentRoom.id}
          className="bg-green-200 flex gap-1 w-full justify-between items-center"
        >
          <span>{currentRoom.status}</span>
          <span>
            {currentRoom.playerNum}/{currentRoom.size}
          </span>
          <span>{currentRoom.title}</span>
          <button
            className="bg-red-200 border-red-400 border-2 rounded-lg px-2 py-1 font-bold hover:bg-red-400"
            onClick={async () => await onExit()}
          >
            exit
          </button>
        </div>
      )}
      {rooms.map(
        ({ id, size, status, playerNum, title }) =>
          id !== currentRoomId && (
            <div
              key={id}
              className="flex gap-1 w-full justify-between items-center"
            >
              <span>{status}</span>
              <span>
                {playerNum}/{size}
              </span>
              <span>{title}</span>
              <button
                className="bg-green-200 border-green-500 border-2 rounded-lg px-2 py-1 font-bold hover:bg-green-500 text-center"
                onClick={async () => await onJoin(id)}
              >
                join
              </button>
            </div>
          ),
      )}
    </div>
  );
};

type NewRoomFormProps = {
  onSubmit: (title: string, size: number) => Promise<void>;
};

const NewRoomForm = ({ onSubmit }: NewRoomFormProps) => {
  const [isShowing, setShowing] = useState(false);
  const [size, setSize] = useState(2);
  const [title, setTitle] = useState("");

  const onClick = async () => {
    setShowing(false);
    setTitle("");
    setSize(2);
    await onSubmit(title, size);
  };

  return (
    <div className="flex flex-row justify-between">
      <button onClick={(e) => setShowing((s) => !s)}>
        {isShowing ? "New Room <" : "New Room >"}
      </button>
      {isShowing && (
        <form className="flex gap-2">
          <input
            placeholder="title"
            type="text"
            value={title}
            onChange={(e) => setTitle((e.target as any).value)}
          />
          <select
            value={size}
            onChange={(e) => setSize((e.target as any).value)}
          >
            {[1, 2, 3, 4].map((s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
          <button onClick={async () => await onClick()}>Add</button>
        </form>
      )}
    </div>
  );
};
