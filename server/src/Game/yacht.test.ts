import { Yacht, Player } from "./yacht";
import { test } from "@jest/globals";

test('Yacht gaem init', () => {
  const players: Player[] = [
    {name: "player1", id: "123"},
    {name: "player2", id: "321"},
  ]
  const game = new Yacht(players);
  expect(game).toBeDefined();
});
