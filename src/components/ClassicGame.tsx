import { useEffect } from "react";
import { ClassicCanvas } from "./canvas/ClassicCanvas";
import { useGameController } from "../hooks/useGameController";
import { Box, Button, Typography } from "@mui/material";

const ClassicGame = () => {
  // console.log("ClassicRefresh");

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
      getComputerMove();
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
