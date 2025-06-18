import { GameBoard } from "../utils/gameBoard";
import { moveFinder } from "../utils/moveFinder";
import { useSettings } from "../store/useSettings";
import { useState } from "react";
import { LocationData, Player } from "../types.ts";

// type Result = "win" | "draw" | "ongoing";

const gameBoard = new GameBoard();
const useGameController = () => {
  const [gameOver, setGameOver] = useState(false);
  const { depth, zeroBasedIndex } = useSettings();
  const [locationData, setLocationData] = useState<LocationData>(null);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [computerTurn, setComputerTurn] = useState(false);
  // const [result, setResult] = useState<Result>("ongoing");

  const makeMove = (col: number) => {
    if (gameBoard.canPlay(col) && !gameOver) {
      const curPlayer: Player =
        gameBoard.moveCount % 2 === 0 ? "human" : "computer";

      //win check
      if (gameBoard.isWinningColumn(col)) {
        setGameOver(true);
        // setResult("win");
        setFeedbackText(
          `${curPlayer === "human" ? "You have " : "The Computer has "}WON!`
        );
        gameBoard.playColumn(col);
        setLocationData(gameBoard.getLocationData());
      } else {
        gameBoard.playColumn(col);
        //draw check
        if (gameBoard.drawnGame()) {
          // setResult("draw");
          setFeedbackText("It/'s a draw!");
          setGameOver(true);
        } else {
          // setResult("ongoing");
          setFeedbackText(
            `${curPlayer === "human" ? "You play" : "Computer plays"} column ${zeroBasedIndex ? col : col + 1}`
          );
          setComputerTurn(!computerTurn);
        }
      }
      setLocationData(gameBoard.getLocationData());
    }
  };

  const getComputerMove = () => {
    const moveOptions = moveFinder(gameBoard, depth);
    console.log(moveOptions);
    let bestMove = 0;
    let bestScore = -Infinity;
    moveOptions.forEach((curScore, curIndex) => {
      if (curScore !== null && curScore >= bestScore) {
        bestMove = curIndex;
        bestScore = curScore;
      }
    });
    return bestMove;
  };

  const resetGame = () => {
    setGameOver(false);
    setLocationData(null);
    setComputerTurn(false);
    setFeedbackText("Your turn");
    gameBoard.resetBoard();
  };

  return {
    locationData,
    feedbackText,
    computerTurn,
    gameOver,
    makeMove,
    getComputerMove,
    resetGame,
  };
};

export { useGameController };
