import styles from "./ClassicGame.module.css";
import { useEffect, useState } from "react";
import { ClassicCanvas } from "../components/ClassicCanvas";
import { useGameController } from "../hooks/useGameController";
import { COMPUTER_DELAY } from "../constants";
import type { LocationData } from "../types/gameBoard.types";

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
      setFeedbackText(moveFeedback.text);
      setComputerTurn(moveFeedback.curPlayer === "human" ? true : false);
    }
  };

  const handleReset = () => {
    resetGame();
    setComputerTurn(false);
    setLocationData(undefined);
    setFeedbackText("Your turn");
  };

  useEffect(() => {
    if (computerTurn) {
      setTimeout(() => {
        let bestMove = getComputerMove();
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
