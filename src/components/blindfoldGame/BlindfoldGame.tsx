import styles from "./BlindfoldGame.module.css";
import { useEffect, useState } from "react";
import { BlindfoldCanvas } from "../canvas/BlindfoldCanvas";
import { SelectColumnButtons } from "../selectColumnButtons/SelectColumnButtons";
import { useGameController } from "../../hooks/useGameController";
import { COMPUTER_DELAY } from "../../constants";

const BlindfoldGame = () => {
  console.log("BlindfoldRefresh");

  const {
    makeMove,
    locationData,
    feedbackText,
    getComputerMove,
    resetGame,
    computerTurn,
  } = useGameController();

  const [showCanvas, setShowCanvas] = useState(false);

  const handleMakeMove = (col: number) => {
    makeMove(col);
  };

  const handleShowCanvas = () => {
    setShowCanvas(true);
  };

  const handleReset = () => {
    setShowCanvas(false);
    resetGame();
  };

  useEffect(() => {
    if (computerTurn) {
      const start = performance.now();
      let bestMove = getComputerMove();
      const end = performance.now();
      const took = end - start;
      setTimeout(
        () => {
          handleMakeMove(bestMove);
        },
        took > COMPUTER_DELAY ? 0 : COMPUTER_DELAY - took
      );
    }
  }, [computerTurn]);

  return (
    <main className={styles.main}>
      {/* {gameOver && <p> GAME OVER!</p>} */}
      <div className={styles.canvasHolder}>
        {showCanvas && <BlindfoldCanvas locationData={locationData} />}
        {!showCanvas && (
          <SelectColumnButtons
            handleClick={handleMakeMove}
            canClick={!computerTurn}
          />
        )}
      </div>
      <p>{feedbackText}</p>
      <button onClick={handleReset}>Reset</button>
      <button
        className={styles.showMeButton}
        onPointerDown={() => handleShowCanvas()}
        onPointerLeave={() => setShowCanvas(false)}
        onPointerUp={() => setShowCanvas(false)}
      >
        Show Me
      </button>
    </main>
  );
};
export { BlindfoldGame };
