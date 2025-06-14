import styles from "./SelectColumnButtons.module.css";
import { useSettings } from "../store/useSettings";
import { GAMEBOARD_WIDTH } from "../constants";

type ChooseColumnButtonsProps = {
  handleClick: (col: number) => void;
  canClick: boolean;
};

const SelectColumnButtons = ({
  handleClick,
  canClick,
}: ChooseColumnButtonsProps) => {
  const { zeroBasedIndex } = useSettings();
  const buttonValues = Array.from({ length: GAMEBOARD_WIDTH }, (_, i) => i);

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
            {zeroBasedIndex ? buttonIndex : buttonIndex + 1}
          </button>
        );
      })}
    </div>
  );
};

export { SelectColumnButtons };
