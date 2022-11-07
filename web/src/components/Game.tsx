import { Room } from "@backend/Game/yacht";
import { CommandProps, CommandReturn, Player } from "@backend/lib/types";
import { useContext, useEffect, useState } from "preact/hooks";
import { getPlayersInRoom } from "../lib/api";
import { SocketContext } from "../lib/context";
import { calculateScore } from "../lib/utils";

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
      console.log({ player, room, players });
    };

    fetchPlayersInRoom().catch((err) => console.error(err));
  }, []);

  const onScore = (idx: number) => {
    // player marks score
    // socket emit score command
    socket.emit(
      "command",
      {
        playerId: player.id,
        command: "score",
        content: { idx },
        roomId: room.id,
      },
      (res: CommandReturn) => {
        // TODO: error check
        console.log(res);
      },
    );
  };

  const onThrow = () => {
    // player throws dice
    // socket emit throw command
    socket.emit("command", {
      playerId: player.id,
      command: "throw",
      roomId: room.id,
      callback: (res: CommandReturn) => {
        // TODO: error check
        console.log(res);
      },
    });
  };

  const onFix = ({ pop, fix }: onFixProps) => {
    // player fixes thrown dices
    // socket emit fix command
    socket.emit("command", {
      playerId: player.id,
      command: "fix",
      content: { pop, fix },
      roomId: room.id,
      callback: (res: CommandReturn) => {
        // TODO: error check
        console.log(res);
      },
    });
  };

  return (
    <div className="flex flex-col w-[600px]">
      <div className="h-5" />
      <Top title={room.title} player={player} />
      <div className="h-5" />
      <div className="flex">
        <ScoreBoard
          player={player}
          players={players}
          room={room}
          onScore={onScore}
        />
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
  player: Player;
  players: Player[];
  room: Room;
  onScore: (idx: number) => void;
};

const ScoreBoard = ({ player, players, room, onScore }: ScoreBoardProps) => {
  const game = room.game!;
  const playerIdOfTurn = game.players[game.playerIdx];
  // const currentPlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="flex gap-1">
      {players.map((playerOfCol, idx) => {
        let scoreList = game.scores[idx];
        const playerIdOfCol = playerOfCol.id;
        if (playerIdOfCol === playerIdOfTurn)
          scoreList = calculateScore([...game.fixed, ...game.eyes]);

        return (
          <div className="flex flex-col gap-1 items-center">
            <div
              className={`px-4 rounded-lg font-bold text-center ${
                playerIdOfCol === playerIdOfTurn && "bg-green-200"
              }`}
            >
              {playerOfCol.name}
            </div>
            {scoreList.map((score, idx) => {
              return (
                <div
                  className={`font-bold rounded-lg px-2 box-border border-gray-700 ${
                    playerIdOfTurn === playerIdOfCol && "text-gray-400"
                  } ${
                    playerIdOfTurn === player.id &&
                    playerIdOfTurn === playerIdOfCol &&
                    "hover:border-2 hover:text-gray-700"
                  }`}
                  onClick={() =>
                    playerIdOfTurn === playerIdOfCol &&
                    playerIdOfTurn === player.id &&
                    onScore(idx)
                  }
                >
                  {score}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

type onFixProps = {
  pop?: number;
  fix?: number;
};

type DicesProps = {
  player: Player;
  onThrow: () => void;
  onFix: (props: onFixProps) => void;
};

const Dices = ({ player, onThrow, onFix }: DicesProps) => {
  return <div></div>;
};
