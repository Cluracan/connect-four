import { useEffect } from "react";
import { ClassicCanvas } from "./canvas/ClassicCanvas";
import { useGameController } from "../hooks/useGameController";
import { COMPUTER_DELAY } from "../constants";
import { Box, Button, Typography } from "@mui/material";

const ClassicGame = () => {
  console.log("ClassicRefresh");
  const {
    locationData,
    feedbackText,
    gameOver,
    computerTurn,
    makeMove,
    getComputerMove,
    resetGame,
  } = useGameController();

  const handleMakeMove = (col: number) => {
    makeMove(col);
  };

  const handleReset = () => {
    if (!computerTurn || gameOver) resetGame();
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
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ClassicCanvas
        handleClick={handleMakeMove}
        canClick={!computerTurn}
        locationData={locationData}
      />

      <Typography sx={{ p: 4 }}>{feedbackText}</Typography>
      <Button onClick={handleReset}>Reset</Button>
    </Box>
  );
};
export { ClassicGame };
