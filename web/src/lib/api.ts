import { Player, Room } from "@yacht/types";

const API_ENDPOINT = "http://127.0.0.1:3000";

export const newPlayerByName = async (name: string): Promise<Player> => {
  const res = await fetch(`${API_ENDPOINT}/user/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const { player } = await res.json();
  return player;
};

export const getRooms = async (): Promise<Room[]> => {
  const res = await fetch(`${API_ENDPOINT}/rooms`);
  const { rooms } = await res.json();
  return rooms;
};

export const createRoom = async (
  title: string,
  size: number,
): Promise<Room> => {
  const res = await fetch(`${API_ENDPOINT}/rooms/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, size }),
  });

  const { room } = await res.json();
  return room;
};

export const joinRoom = async (
  player: string,
  roomId: string,
): Promise<Room> => {
  const res = await fetch(`${API_ENDPOINT}/rooms/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, roomId }),
  });
  const { room } = await res.json();
  return room;
};

export const exitRoom = async (player: string) => {
  await fetch(`${API_ENDPOINT}/rooms/exit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player }),
  });
};

export const getPlayerById = async (playerId: string): Promise<Player> => {
  const res = await fetch(`${API_ENDPOINT}/player/${playerId}`);
  const { player } = await res.json();
  return player;
};

export const getPlayersInRoom = async (roomId: string): Promise<Player[]> => {
  const res = await fetch(`${API_ENDPOINT}/user/room/${roomId}`);
  const { players } = await res.json();
  return players;
};
