import { expect, test } from "vitest";
import { negamax } from "../utils/negamax";
import { GameBoard } from "../utils/gameArrayBoard";
import { negaBITmax, bitSolve } from "../utils/negaBITmax";
import { GameBitBoard } from "../utils/gameBitBoard";
import { ponsNegamax, ponsSolve } from "../utils/ponsNegamax";
import { PonsBitBoard } from "../utils/ponsBitBoard";
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

// test.each(endEasyTests)("check(%s) against (%i)", (history, score) => {
//   const testBoard = new GameBoard(history);
//   expect(negamax(testBoard, -Infinity, Infinity)).toBe(score);
// });

// test.each(endEasyTests)("check(%s) against (%i)", (history, score) => {
//   const testBoard = new GameBitBoard(history);
//   expect(negaBITmax(testBoard, -Infinity, Infinity)).toBe(score);
// });

test.each(endEasyTests)("check(%s) against (%i)", (history, score) => {
  const testBoard = new GameBitBoard(history);
  expect(bitSolve(testBoard)).toBe(score);
});

// test.each(endEasyTests)("check(%s) against (%i)", (history, score) => {
//   const testBoard = new PonsBitBoard(history);
//   expect(ponsNegamax(testBoard, -Infinity, Infinity)).toBe(score);
// });

// test.each(endEasyTests)("check(%s) against (%i)", (history, score) => {
//   const testBoard = new PonsBitBoard(history);
//   expect(ponsSolve(testBoard)).toBe(score);
// });
