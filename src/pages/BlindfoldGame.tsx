import { useEffect, useState } from "react";
import { Canvas } from "../components/Canvas";
import type { LocationData } from "../types/gameBoard.types";
import { SelectColumnButtons } from "../components/SelectColumnButtons";
import { useGameController } from "../hooks/useGameController";
const BlindfoldGame = () => {
  const { makeMove, getLocationData, getComputerMove } = useGameController();
  const [computerTurn, setComputerTurn] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [locationData, setLocationData] = useState<Set<LocationData>>();

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

  useEffect(() => {
    if (computerTurn) {
      setTimeout(() => {
        console.log("computer turnb");
        let bestMove = getComputerMove(4);
        handleMakeMove(bestMove);
      }, 1500);
    }
    console.log("go");
  }, [computerTurn]);

  console.log("BlindfoldRefresh");
  return (
    <>
      <SelectColumnButtons
        handleClick={handleMakeMove}
        canClick={!computerTurn}
      />

      <Canvas locationData={locationData} />
      <button
        onClick={() => {
          let locationData = getLocationData();
          setLocationData(locationData);
        }}
      >
        Show Me
      </button>
      <p>{feedbackText}</p>
    </>
  );
};
export { BlindfoldGame };
