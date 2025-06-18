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
    if (!computerTurn) resetGame();
  };

  useEffect(() => {
    if (computerTurn) {
      const start = performance.now();
      let bestMove = getComputerMove();
      const end = performance.now();
      const elapsed = end - start;
      setTimeout(
        () => {
          handleMakeMove(bestMove);
        },
        elapsed > COMPUTER_DELAY ? 0 : COMPUTER_DELAY - elapsed
      );
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
