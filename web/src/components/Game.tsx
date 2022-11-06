import { Room } from "@backend/Game/yacht";
import { CommandProps, CommandReturn, Player } from "@backend/lib/types";
import { useContext, useEffect, useState } from "preact/hooks";
import { getPlayersInRoom } from "../api";
import { SocketContext } from "../context";

type GameProps = {
  player: Player;
  room: Room;
};

export const Game = ({ player, room }: GameProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchPlayersInRoom = async () => {
      const playersInRoom = await getPlayersInRoom(room.id);
      setPlayers(playersInRoom);
    };

    fetchPlayersInRoom().catch((err) => console.error(err));
  }, []);

  const onScore = (idx: number) => {
    // player marks score
    // socket emit score command
    socket.emit(
      "command",
      { playerId: player.id, command: "score", content: { idx } },
      (res: CommandReturn) => {
        // TODO: error check
        console.log(res);
      },
    );
  };

  const onThrow = () => {
    // player throws dice
    // socket emit throw command
    socket.emit(
      "command",
      { playerId: player.id, command: "throw" },
      (res: CommandReturn) => {
        // TODO: error check
        console.log(res);
      },
    );
  };

  const onFix = ({pop, fix}: onFixProps) => {
    // player fixes thrown dices
    // socket emit fix command
    socket.emit(
      "command",
      { playerId: player.id, command: "fix", content: { pop, fix } },
      (res: CommandReturn) => {
        // TODO: error check
        console.log(res);
      },
    );
  };

  return (
    <div className="flex flex-col">
      <Top title={room.title} player={player} />
      <div className="flex">
        <ScoreBoard players={players} room={room} onScore={onScore} />
        <Dices player={player} onThrow={onThrow} onFix={onFix} />
      </div>
    </div>
  );
};

type TopProps = {
  title: string;
  player: Player;
};

const Top = ({ title, player }: TopProps) => {
  return (
    <div className="flex justify-between">
      <h1 className="font-bold text-4xl">{title}</h1>
      <div className="flex flex-col items-end">
        <span className="font-bold">{player.name}</span>
        <span className="text-xs text-gray-400">{player.id}</span>
      </div>
    </div>
  );
};

type ScoreBoardProps = {
  players: Player[];
  room: Room;
  onScore: (idx: number) => void;
};

const ScoreBoard = ({ players, room }: ScoreBoardProps) => {
  return <div></div>;
};

type onFixProps = {
  pop?: number;
  fix?: number;
}

type DicesProps = {
  player: Player;
  onThrow: () => void;
  onFix: (props: onFixProps) => void;
};

const Dices = ({ player, onThrow, onFix }: DicesProps) => {
  return <div></div>;
};
