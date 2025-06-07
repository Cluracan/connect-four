import { GameBoard } from "../utils/gameBoard";

type ChooseColumnButtonsProps = {
  handleClick: (col: number) => void;
};

let boardWidth = GameBoard.width;
const PlayColumnButtons = ({ handleClick }: ChooseColumnButtonsProps) => {
  const buttonValues = Array.from({ length: boardWidth }, (v, i) => i);
  return (
    <>
      {buttonValues.map((buttonIndex) => {
        return (
          <button key={buttonIndex} onClick={() => handleClick(buttonIndex)}>
            {buttonIndex + 1}
          </button>
        );
      })}
    </>
  );
};

export { PlayColumnButtons };
