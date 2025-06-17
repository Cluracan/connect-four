import styles from "./ClassicGame.module.css";
import { useEffect } from "react";
import { ClassicCanvas } from "../canvas/ClassicCanvas";
import { useGameController } from "../../hooks/useGameController";
import { COMPUTER_DELAY } from "../../constants";

const ClassicGame = () => {
  console.log("ClassicRefresh");
  const {
    makeMove,
    locationData,
    feedbackText,
    getComputerMove,
    resetGame,
    computerTurn,
  } = useGameController();

  const handleMakeMove = (col: number) => {
    makeMove(col);
  };

  const handleReset = () => {
    resetGame();
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
