import { useEffect, useState } from "react";
import type { LocationData } from "../types/gameBoard.types";
import { BlindfoldCanvas } from "../components/BlindfoldCanvas";
import { SelectColumnButtons } from "../components/SelectColumnButtons";
import { useGameController } from "../hooks/useGameController";
import { COMPUTER_DELAY } from "../constants";
import styles from "./BlindfoldGame.module.css";
const BlindfoldGame = () => {
  console.log("BlindfoldRefresh");
  const { makeMove, getLocationData, getComputerMove, resetGame } =
    useGameController();
  const [computerTurn, setComputerTurn] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [locationData, setLocationData] = useState<LocationData>();
  const [showCanvas, setShowCanvas] = useState(false);

  const handleMakeMove = (col: number) => {
    let moveFeedback = makeMove(col);
    console.log(moveFeedback);
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

  const handleShowCanvas = () => {
    setShowCanvas(true);
    setLocationData(getLocationData());
  };

  const handleReset = () => {
    setShowCanvas(false);
    resetGame();
    setLocationData(undefined);
    setFeedbackText("Your turn");
  };

  useEffect(() => {
    if (computerTurn) {
      setTimeout(() => {
        let bestMove = getComputerMove(4);
        handleMakeMove(bestMove);
      }, COMPUTER_DELAY);
    }
  }, [computerTurn]);

  return (
    <main className={styles.main}>
      <div className={styles.canvasHolder}>
        {showCanvas && <BlindfoldCanvas locationData={locationData} />}
        {!showCanvas && (
          <SelectColumnButtons
            handleClick={handleMakeMove}
            canClick={!computerTurn}
          />
        )}
      </div>
      <button onClick={handleReset}>Reset</button>
      <p>{feedbackText}</p>
      <button
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
