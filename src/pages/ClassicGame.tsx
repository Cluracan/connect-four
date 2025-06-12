import { useEffect, useState } from "react";
import type { LocationData } from "../types/gameBoard.types";
import { ClassicCanvas } from "../components/ClassicCanvas";
import { useGameController } from "../hooks/useGameController";
import { COMPUTER_DELAY } from "../constants";
import styles from "./ClassicGame.module.css";

const ClassicGame = () => {
  console.log("ClassicRefresh");
  const { makeMove, getComputerMove, resetGame } = useGameController();
  const [computerTurn, setComputerTurn] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [locationData, setLocationData] = useState<LocationData>();

  const handleMakeMove = (col: number) => {
    let moveFeedback = makeMove(col);
    if (moveFeedback.success) {
      setLocationData(moveFeedback.locationData);
      switch (moveFeedback.result) {
        case "ongoing":
          setFeedbackText(
            `${
              moveFeedback.curPlayer === "human" ? "You play" : "Computer plays"
            } column ${moveFeedback.col}`
          );
          break;
        case "win":
          setFeedbackText(`${moveFeedback.curPlayer} has WON!`);
          break;
        case "draw":
          setFeedbackText(`It/'s a draw!`);
      }
      setComputerTurn(moveFeedback.curPlayer === "human" ? true : false);
    }
  };

  const handleReset = () => {
    resetGame();
    setLocationData(undefined);
    setFeedbackText("Your turn");
  };

  useEffect(() => {
    if (computerTurn) {
      //find and execute computer move
      setTimeout(() => {
        let bestMove = getComputerMove(4);
        handleMakeMove(bestMove);
      }, COMPUTER_DELAY);
    }
  }, [computerTurn]);

  return (
    <main className={styles.main}>
      <ClassicCanvas
        handleClick={handleMakeMove}
        canClick={!computerTurn}
        locationData={locationData}
      />

      <p className={styles.feedback}>{feedbackText}</p>
      <button onClick={handleReset}>Reset</button>
    </main>
  );
};
export { ClassicGame };
