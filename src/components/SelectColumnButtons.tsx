import { GameBoard } from "../utils/gameBoard";
import styles from "./SelectColumnButtons.module.css";

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
    <div className={styles.buttonHolder}>
      {buttonValues.map((buttonIndex) => {
        return (
          <button
            className={styles.button}
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
    </div>
  );
};

export { SelectColumnButtons };
