import type { Yacht } from "./yacht";

export interface Player {
  id: string;
  name: string;
  room?: string | undefined;
}

export class Room {
  id: string;
  title: string;
  size: number;
  playerNum: number;
  status: "waiting" | "playing" | "done";
  game?: Yacht;

  constructor(id: string, title: string, size: number) {
    this.status = size === 1 ? "playing" : "waiting";
    this.title = title;
    this.size = +size;
    this.playerNum = 0;
    this.id = id;
  }
}
