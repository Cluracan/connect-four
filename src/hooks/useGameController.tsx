import { LocationData, Player } from "../types/gameBoard.types";
import { GameBoard } from "../utils/gameBoard";
import { moveFinder } from "../utils/moveFinder";
import { useState } from "react";
type Result = "win" | "draw" | "ongoing";
type MakeMove = {
  success: boolean;
  col?: number;
  newColHeight?: number;
  locationData?: Set<LocationData>;
  curPlayer?: Player;
  result?: Result;
};

const gameBoard = new GameBoard();
const useGameController = () => {
  const [gameOver, setGameOver] = useState(false);
  const [turn, setTurn] = useState<Player>("human");

  const makeMove = (col: number): MakeMove => {
    if (gameBoard.canPlay(col) && !gameOver) {
      const curPlayer: Player =
        gameBoard.moveCount % 2 === 0 ? "human" : "computer";
      let result: Result = "ongoing";
      if (gameBoard.isWinningColumn(col)) {
        setGameOver(true);
        result = "win";
      }
      gameBoard.playColumn(col);
      if (gameBoard.drawnGame()) {
        result = "draw";
      }
      const newColHeight = gameBoard.bitCount(
        gameBoard.mask & gameBoard.columnMask(col)
      );
      const locationData = gameBoard.getLocationData();
      return {
        success: true,
        col,
        newColHeight,
        locationData,
        curPlayer,
        result,
      };
    } else {
      return { success: false };
    }
  };

  const getComputerMove = (depth: number) => {
    const moveOptions = moveFinder(gameBoard, depth);
    let bestMove = 0;
    let bestScore = -Infinity;
    moveOptions.forEach((curScore, curIndex) => {
      if (curScore !== null && curScore >= bestScore) {
        bestMove = curIndex;
        bestScore = curScore;
      }
    });
    console.log(`computer chooses ${bestMove} scoring ${bestScore}`);
    return bestMove;
  };

  const getLocationData = () => {
    return gameBoard.getLocationData();
  };
  return { makeMove, getLocationData, getComputerMove };
};

export { useGameController };
