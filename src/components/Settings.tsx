import { Box, Button, Paper, Slider, Typography } from "@mui/material";
import { useGameController } from "../hooks/useGameController";
import { useSettings } from "../store/useSettings";
import { useNavigate } from "@tanstack/react-router";
import { MAX_DEPTH, MIN_DEPTH } from "../constants";

export const Settings = () => {
  const navigate = useNavigate();
  const { depth, updateDepth, zeroBasedIndex, toggleZeroBasedIndex } =
    useSettings();
  const { resetGame } = useGameController();

  const handleGameClick = (target: string) => {
    resetGame();
    navigate({ to: target });
  };

  return (
    <Paper
      elevation={16}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifySelf: "center",
        minWidth: "30vw",
        margin: "2rem",
        padding: "2rem",
      }}
    >
      <Typography component={"h2"} variant="h4">
        Settings
      </Typography>

      <Slider
        sx={{ m: 4, maxWidth: 200 }}
        aria-label="Difficulty"
        value={depth}
        getAriaValueText={(value) => `${value}`}
        valueLabelDisplay="auto"
        shiftStep={1}
        step={1}
        marks
        min={MIN_DEPTH}
        max={MAX_DEPTH}
        onChange={(_, value) => {
          updateDepth(value);
        }}
      />
      <Typography variant="subtitle1">Difficulty level: {depth}</Typography>

      <Button
        sx={{ m: 4 }}
        variant="outlined"
        onClick={() => toggleZeroBasedIndex()}
      >
        {`${zeroBasedIndex ? "I'm a coder" : "I'm  normal"}`}
      </Button>
      <Typography variant="body2">
        (Columns labelled {zeroBasedIndex ? "0 to 6" : "1 to 7"})
      </Typography>

      <Typography variant="h5" sx={{ my: 3 }}>
        Let's Play!
      </Typography>
      <Box
        display={"flex"}
        gap={"1rem"}
        flexWrap={"wrap"}
        justifyContent={"center"}
      >
        <Button variant="contained" onClick={() => handleGameClick("/classic")}>
          Classic Game
        </Button>
        <Button
          variant="contained"
          onClick={() => handleGameClick("/blindfold")}
        >
          Blindfold Game
        </Button>
      </Box>
    </Paper>
  );
};
