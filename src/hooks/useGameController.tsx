import { GameBoard } from "../utils/gameBoard";
import { useState } from "react";
const gameBoard = new GameBoard();
const useGameController = () => {
  const [winner, setWinner] = useState<"none" | "player" | "computer">("none");
  const [turn, setTurn] = useState<"player" | "computer">("player");

  const makeMove = (col: number) => {
    //test for canplay,winner
    gameBoard.playColumn(col);
  };
  const getLocationData = () => {
    return gameBoard.getLocationData();
  };
  return { makeMove, getLocationData };
};

export { useGameController };
