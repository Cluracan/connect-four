import { useEffect, useState } from "react";
import { BlindfoldCanvas } from "../canvas/BlindfoldCanvas";
import { SelectColumnButtons } from "../selectColumnButtons/SelectColumnButtons";
import { useGameController } from "../../hooks/useGameController";
import { COMPUTER_DELAY } from "../../constants";
import { Button, Box, Typography } from "@mui/material";

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
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* {gameOver && <p> GAME OVER!</p>} */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "50vh",
        }}
      >
        {showCanvas && <BlindfoldCanvas locationData={locationData} />}
        {!showCanvas && (
          <SelectColumnButtons
            handleClick={handleMakeMove}
            canClick={!computerTurn}
          />
        )}
      </Box>
      <Typography variant="body1">{feedbackText}</Typography>
      <Button onClick={handleReset}>Reset</Button>
      <Button
        onPointerDown={() => handleShowCanvas()}
        onPointerLeave={() => setShowCanvas(false)}
        onPointerUp={() => setShowCanvas(false)}
      >
        Show Me
      </Button>
    </Box>
  );
};
export { BlindfoldGame };
