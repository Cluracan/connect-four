import { GameBoard } from "../utils/gameBoard";

type ChooseColumnButtonsProps = {
  handleClick: (col: number) => void;
  canClick: boolean;
};

let boardWidth = GameBoard.width;

const SelectColumnButtons = ({
  handleClick,
  canClick,
}: ChooseColumnButtonsProps) => {
  const buttonValues = Array.from({ length: boardWidth }, (_, i) => i);
  return (
    <>
      {buttonValues.map((buttonIndex) => {
        return (
          <button
            key={buttonIndex}
            onClick={() => {
              if (canClick) {
                handleClick(buttonIndex);
              }
            }}
          >
            {buttonIndex + 1}
          </button>
        );
      })}
    </>
  );
};

export { SelectColumnButtons };
