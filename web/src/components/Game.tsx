import { Room } from "@backend/Game/yacht";
import { Player } from "@backend/lib/types";
import { useEffect, useState } from "preact/hooks";
import { getPlayersInRoom } from "../api";

type GameProps = {
  player: Player;
  room: Room;
};

export const Game = ({ player, room }: GameProps) => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayersInRoom = async () => {
      const playersInRoom = await getPlayersInRoom(room.id);
      setPlayers(playersInRoom);
    }

    fetchPlayersInRoom().catch(err => console.error(err))
  });

  return (
    <div className="flex flex-col">
      <Top title={room.title} player={player} />
      <div className="flex">
        <ScoreBoard />
        <Dices />
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
  scores: 
}