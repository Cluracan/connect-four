import { LocationData, Player } from "../types/gameBoard.types";
import { GameBoard } from "../utils/gameBoard";
import { moveFinder } from "../utils/moveFinder";
import { useState } from "react";
type Result = "win" | "draw" | "ongoing";
type MakeMove =
  | {
      success: true;
      col: number;
      newColHeight: number;
      locationData: LocationData;
      curPlayer: Player;
      result: Result;
      text: string;
    }
  | {
      success: false;
    };

const gameBoard = new GameBoard();
const useGameController = () => {
  const [gameOver, setGameOver] = useState(false);

  const makeMove = (col: number): MakeMove => {
    if (gameBoard.canPlay(col) && !gameOver) {
      const curPlayer: Player =
        gameBoard.moveCount % 2 === 0 ? "human" : "computer";
      let result: Result = "ongoing";
      let text: string = `${curPlayer === "human" ? "You play" : "Computer plays"} column ${col}`;
      if (gameBoard.isWinningColumn(col)) {
        setGameOver(true);
        result = "win";
        text = `${curPlayer === "human" ? "You have " : "The Computer has "}WON!`;
      }
      gameBoard.playColumn(col);
      if (gameBoard.drawnGame()) {
        result = "draw";
        text = `It/'s a draw!`;
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
        text,
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

  const resetGame = () => {
    setGameOver(false);
    gameBoard.resetBoard();
  };

  return { makeMove, getLocationData, getComputerMove, resetGame };
};

export { useGameController };
