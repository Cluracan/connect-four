import type { LocationData } from "../types/gameBoard.types";
import { ClassicCanvas } from "../components/ClassicCanvas";

import { useEffect, useState } from "react";
import { useGameController } from "../hooks/useGameController";

const ClassicGame = () => {
  const { makeMove, getComputerMove, resetGame } = useGameController();
  const [computerTurn, setComputerTurn] = useState(false);
  const [feedbackText, setFeedbackText] = useState("Your turn");
  const [locationData, setLocationData] = useState<LocationData>();

  const handleMakeMove = (col: number) => {
    let moveFeedback = makeMove(col);
    console.log(moveFeedback);
    if (moveFeedback.success) {
      setLocationData(moveFeedback.locationData);
      console.log(locationData);
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
      setTimeout(() => {
        let bestMove = getComputerMove(4);
        handleMakeMove(bestMove);
      }, 1500);
    }
  }, [computerTurn]);

  console.log("ClassicRefresh");
  return (
    <>
      <ClassicCanvas
        handleClick={handleMakeMove}
        canClick={!computerTurn}
        locationData={locationData}
      />

      <button onClick={handleReset}>Reset</button>
      <p>{feedbackText}</p>
    </>
  );
};
export { ClassicGame };
