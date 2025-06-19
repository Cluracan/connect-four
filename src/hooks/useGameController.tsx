import { GameBoard } from "../utils/gameBoard";
import { COMPUTER_DELAY } from "../constants.ts";
import { useSettings } from "../store/useSettings";
import { useState, useEffect, useRef } from "react";
import { LocationData, Player } from "../types.ts";
import Worker from "../worker?worker";
// type Result = "win" | "draw" | "ongoing";

const gameBoard = new GameBoard();
const useGameController = () => {
  const [gameOver, setGameOver] = useState(false);
  const { depth, zeroBasedIndex } = useSettings();
  const [locationData, setLocationData] = useState<LocationData>(null);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [computerTurn, setComputerTurn] = useState(false);
  // const [result, setResult] = useState<Result>("ongoing");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker();
    workerRef.current.onmessage = (e) => {
      console.log(e.data);
    };
    workerRef.current.postMessage("Hello from gameControl");
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

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
    if (workerRef.current) {
      const start = performance.now();

      workerRef.current.postMessage({
        action: "find",
        boardMask: gameBoard.boardMask,
        currentPosition: gameBoard.currentPosition,
        moveCount: gameBoard.moveCount,
        moveHistory: gameBoard.moveHistory,
        depth,
      });
      workerRef.current.onmessage = (e) => {
        const end = performance.now();
        const elapsed = end - start;
        setTimeout(
          () => {
            makeMove(e.data.bestMove);
          },
          elapsed > COMPUTER_DELAY ? 0 : COMPUTER_DELAY - elapsed
        );
      };
    }

    // const moveOptions = moveFinder(gameBoard, depth);
    // let bestMove = 0;
    // let bestScore = -Infinity;
    // moveOptions.forEach((curScore, curIndex) => {
    //   if (curScore !== null && curScore >= bestScore) {
    //     bestMove = curIndex;
    //     bestScore = curScore;
    //   }
    // });
    // return bestMove;
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
