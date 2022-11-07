import type { Room } from "./Game/yacht";
import type { Player } from "./lib/types";

export class DB {
  players: Player[];
  rooms: Room[];

  constructor() {
    this.players = [];
    this.rooms = [];
  }

  getPlayerById(id: string) {
    return this.players.find((p) => p.id === id);
  }

  getRoomById(id: string) {
    return this.rooms.find((r) => r.id === id);
  }

  getPlayersInRoom(roomId: string) {
    return this.players.filter((p) => p.room === roomId);
  }
}
