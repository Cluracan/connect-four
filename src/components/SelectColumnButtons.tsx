import { useSettings } from "../store/useSettings";
import { GAMEBOARD_WIDTH } from "../constants";
import { Box, Button } from "@mui/material";

type ChooseColumnButtonsProps = {
  handleClick: (col: number) => void;
  canClick: boolean;
};

export const SelectColumnButtons = ({
  handleClick,
  canClick,
}: ChooseColumnButtonsProps) => {
  const { zeroBasedIndex } = useSettings();

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {Array.from({ length: GAMEBOARD_WIDTH }).map((_, buttonIndex) => {
        return (
          <Button
            sx={{ minWidth: 0 }}
            variant="contained"
            key={buttonIndex}
            onClick={() => {
              if (canClick) {
                handleClick(buttonIndex);
              }
            }}
          >
            {zeroBasedIndex ? buttonIndex : buttonIndex + 1}
          </Button>
        );
      })}
    </Box>
  );
};
