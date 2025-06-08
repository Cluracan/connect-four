import type { LocationData } from "../types/gameBoard.types";
import { Canvas } from "../components/Canvas";
import { SelectColumnButtons } from "../components/SelectColumnButtons";
import { useEffect, useState } from "react";
import { useGameController } from "../hooks/useGameController";

const BlindfoldGame = () => {
  const { makeMove, getLocationData, getComputerMove, resetGame } =
    useGameController();
  const [computerTurn, setComputerTurn] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [locationData, setLocationData] = useState<Set<LocationData>>();
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
    console.log(locationData);
  };

  const handleReset = () => {
    setShowCanvas(false);
    resetGame();
    setFeedbackText("Your turn");
  };

  useEffect(() => {
    if (computerTurn) {
      setTimeout(() => {
        let bestMove = getComputerMove(4);
        handleMakeMove(bestMove);
      }, 1500);
    }
  }, [computerTurn]);

  console.log("BlindfoldRefresh");
  return (
    <>
      <SelectColumnButtons
        handleClick={handleMakeMove}
        canClick={!computerTurn}
      />
      {showCanvas && <Canvas locationData={locationData} />}
      <button
        //show/hide canvas maybe on mousedown/mouseup and touchstart/touchend though apparently click gets converted so maybe mousedown/up also do
        // NEED TO ONLY RUN ONE OF THESE DEPENDING ON SCREEN SIZE AS mousedown fires on touchdownup if clicked

        onTouchStart={() => {
          handleShowCanvas();
          console.log("touchstart");
        }}
        onTouchEnd={() => {
          setShowCanvas(false);
          console.log("touchend");
        }}
        onMouseDown={() => {
          handleShowCanvas();
          console.log("mousedown");
        }}
        onMouseUp={() => {
          setShowCanvas(false);
          console.log("mouseup");
        }}
      >
        Show Me
      </button>
      <button onClick={handleReset}>Reset</button>
      <p>{feedbackText}</p>
    </>
  );
};
export { BlindfoldGame };
