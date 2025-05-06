import { expect, test } from "vitest";
import { negamax } from "../utils/negamax";
import { GameBoard } from "../utils/gameBoard";
import { readFileSync } from "fs";

const endEasyData = readFileSync(
  "./src/tests/negamax-data/Test_L3_R1",
  "utf-8"
);
const endEasyTests = endEasyData
  .split(/\n/)
  .map((line) =>
    line
      .split(" ")
      .map((entry, index) => (index === 0 ? entry : parseInt(entry)))
  );

// const testBoard = new GameBoard("7757773257231346234144653122551152344");
// test("negamax exists", () => {
//   expect(negamax(testBoard)).toBe(1);
// });

// test.each(endEasyTests)(`history(%s)->%s`, (history, expected) => {
//   console.log("TEST~IJNG");
//   const testBoard = new GameBoard(history);
//   console.log(testBoard);
//   expect(negamax(testBoard)).toBe(expected);
// });

test.each(endEasyTests)("check(%s) against (%i)", (history, score) => {
  const testBoard = new GameBoard(history);
  expect(negamax(testBoard, -Infinity, Infinity)).toBe(score);
});
