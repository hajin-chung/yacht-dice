import { CommandProps, CommandReturn, emptyScore } from "../lib/types";
import { v4 } from "uuid";

export class Room {
  id: string;
  title: string;
  size: number;
  playerNum: number;
  status: "waiting" | "playing" | "done";
  game?: Yacht;

  constructor(title: string, size: number) {
    this.status = size === 1 ? "playing" : "waiting";
    this.title = title;
    this.size = size;
    this.playerNum = 0;
    this.id = v4();
  }
}

// TODO: try to remove bangs
export class Yacht {
  players: string[];
  /**
   * rows are player indices
   *
   * columns are respectively 1, 2, 3, 4, 5, 6, full house, four of a kind, small straight, large straight, choice, yacht, bonus
   */
  scores: number[][];
  turn: number;
  isEnded: boolean;

  /**
   *  fixed dices
   * */
  fixed: number[];

  /**
   * eyes after dice throw (just thrown dices)
   */
  eyes: number[];

  /**
   * player index of this turn
   */
  playerIdx: number;

  /**
   * selected dice after throw
   * just for live performance
   */
  selected: number[];
  leftThrows: number;

  constructor(players: string[]) {
    this.players = players;
    this.scores = Array(players.length).fill(emptyScore);
    this.playerIdx = 0;
    this.turn = 0;
    this.isEnded = false;
    this.eyes = [];
    this.fixed = [];
    this.selected = [];
    this.leftThrows = 3;
  }

  nextTurn() {
    this.turn++;
    this.playerIdx = (this.turn + 1) % this.players.length;
    this.eyes = [];
    this.fixed = [];
    this.selected = [];
    this.leftThrows = 3;

    if (this.turn === 12 * this.players.length + 1) {
      // game end
      this.isEnded = true;
    }
  }

  command({ playerId, command, content }: CommandProps): CommandReturn {
    if (this.players[this.playerIdx] !== playerId)
      return { msg: "wrong player", error: true };

    if (command === "score") {
      if (this.leftThrows === 3)
        return { msg: "didn't throw yet", error: true };
      if (typeof content.idx !== "number")
        return { msg: "content idx undefined", error: true };
      if (0 <= content.idx && content.idx < emptyScore.length)
        return { msg: "content idx out of bound", error: true };

      this.scores[this.playerIdx]![content.idx] =
        this.calculateScore()[content.idx]!;
      this.nextTurn();
      return { msg: "success", error: false };
    }

    if (command === "throw") {
      if (this.leftThrows === 0) return { msg: "no turns left", error: true };
      if (this.eyes.length === 0)
        return { msg: "all dices are fixed", error: true };

      this.eyes = this.throw();
      this.leftThrows--;
      return { msg: "success", error: false };
    }

    if (command === "fix") {
      if (typeof content.pop !== "number" && typeof content.fix !== "number")
        return { msg: "content pop and fix undefined", error: true };
      if (
        typeof content.pop === "number" &&
        !(0 <= content.pop && content.pop < this.fixed.length)
      )
        return { msg: "content pop out of bound", error: true };
      if (
        typeof content.fix === "number" &&
        !(0 <= content.fix && content.fix < this.eyes.length)
      )
        return { msg: "content fix out of bound", error: true };

      if (typeof content.pop === "number") {
        this.eyes.push(this.fixed[content.pop]!);
        this.fixed.splice(content.pop, 1);
      }
      if (typeof content.fix === "number") {
        this.fixed.push(this.eyes[content.fix]!);
        this.eyes.splice(content.fix, 1);
      }

      return { msg: "success", error: false };
    }

    return {
      msg: "wrong command",
      error: true,
    };
  }

  throwSingleDice(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  throw(): number[] {
    const eyes = Array(this.eyes.length).map((_) => this.throwSingleDice());

    return eyes;
  }

  calculateScore(): number[] {
    const dices = [...this.fixed, ...this.eyes];
    const count = [0, 0, 0, 0, 0, 0, 0];
    const countCount = [0, 0, 0, 0, 0, 0];
    let sum = 0;
    let sumSingles = 0;
    dices.forEach((eye) => {
      count[eye]++;
      sum += eye;
    });
    count.forEach((c, i) => {
      countCount[c]++;
      sumSingles += c * i;
    });

    let isSmallStraight = false;
    let isLargeStraight = false;

    for (let i = 1; i <= 3; i++) {
      let flag = false;
      for (let j = i; j <= i + 3; j++) flag = flag && count[j]! > 0;
      if (flag) {
        isSmallStraight = true;
        break;
      }
    }

    for (let i = 1; i <= 2; i++) {
      let flag = false;
      for (let j = i; j <= i + 4; j++) flag = flag && count[j]! > 0;
      if (flag) {
        isLargeStraight = true;
        break;
      }
    }

    const score = [
      count[1]!,
      count[2]! * 2,
      count[3]! * 3,
      count[4]! * 4,
      count[5]! * 5,
      count[6]! * 6,
      countCount[2] === 1 && countCount[3] === 1 ? sum : 0,
      countCount[4] === 1 ? sum : 0,
      isSmallStraight ? 15 : 0,
      isLargeStraight ? 30 : 0,
      sum,
      countCount[5] === 1 ? 50 : 0,
      sumSingles >= 63 ? 35 : 0,
    ];

    return score;
  }
}
