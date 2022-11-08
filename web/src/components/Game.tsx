// import type { CommandReturn } from "@yacht/yacht";
import { CommandReturn, ScoreNames, calculateScore } from "@yacht/yacht";
import { Player, Room } from "@yacht/types";
import { useContext, useEffect, useState } from "preact/hooks";
import { getPlayersInRoom } from "../lib/api";
import { SocketContext } from "../lib/context";

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
        console.log("client", res);
      },
    );
  };

  const onThrow = () => {
    // player throws dice
    // socket emit throw command
    socket.emit(
      "command",
      {
        playerId: player.id,
        command: "throw",
        roomId: room.id,
      },
      (res: CommandReturn) => {
        // TODO: error check
        console.log("client", res);
      },
    );
  };

  const onFix = ({ pop, fix }: onFixProps) => {
    // player fixes thrown dices
    // socket emit fix command
    socket.emit(
      "command",
      {
        playerId: player.id,
        command: "fix",
        content: { pop, fix },
        roomId: room.id,
      },
      (res: CommandReturn) => {
        // TODO: error check
        console.log("client", res);
      },
    );
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
        <Dices player={player} room={room} onThrow={onThrow} onFix={onFix} />
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

  return (
    <div className="flex gap-1">
      <div className="flex flex-col gap-1 items-center">
        <div>players</div>
        {ScoreNames.map((name) => (
          <div className="font-bold" key={name}>
            {name}
          </div>
        ))}
      </div>
      {players.map((playerOfCol, idx) => {
        let scoreList = game.scores[idx];
        let fixedList = game.fixedScores[idx];
        const playerIdOfCol = playerOfCol.id;
        if (playerIdOfCol === playerIdOfTurn) {
          let calculatedScores = calculateScore(game.fixed, game.eyes);
          scoreList = scoreList.map((s, i) => {
            if (fixedList[i]) return s;
            else return calculatedScores[i];
          });
        }

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
                    playerIdOfTurn === playerIdOfCol &&
                    !fixedList[idx] &&
                    "text-gray-400"
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
  room: Room;
  onThrow: () => void;
  onFix: (props: onFixProps) => void;
};

const Dices = ({ player, room, onThrow, onFix }: DicesProps) => {
  const game = room.game!;
  const playerIdOfTurn = game.players[game.playerIdx];
  const isPlayerTurn = player.id === playerIdOfTurn;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        {game.fixed.map((eye, idx) => (
          <Dice eye={eye} onClick={() => isPlayerTurn && onFix({ pop: idx })} />
        ))}
        {Array(5 - game.fixed.length).map((_) => (
          <Dice eye={0} />
        ))}
      </div>
      <div className="flex w-full justify-between">
        {game.eyes.map((eye, idx) => (
          <Dice eye={eye} onClick={() => isPlayerTurn && onFix({ fix: idx })} />
        ))}
      </div>
      <button onClick={() => isPlayerTurn && onThrow()}>Throw</button>
    </div>
  );
};

type DiceProps = {
  eye: number;
  onClick?: () => void;
};

const Dice = ({ eye, onClick }: DiceProps) => {
  if (eye === 0) return <div></div>;
  return <div onClick={() => onClick && onClick()}>{eye}</div>;
};
