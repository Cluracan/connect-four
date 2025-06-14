import { useNavigate } from "@tanstack/react-router";
import { useGameController } from "../hooks/useGameController";
import styles from "./Settings.module.css";
import { useSettings } from "../store/useSettings";

const Settings = () => {
  const navigate = useNavigate();

  const {
    depth,
    increaseDepth,
    decreaseDepth,
    zeroBasedIndex,
    toggleZeroBasedIndex,
  } = useSettings();
  const { resetGame } = useGameController();
  return (
    <div className={styles.main}>
      <div className={styles.optionsHolder}>
        <h2>Connect Four</h2>
        <p>Choose your difficulty:</p>
        <div className={styles.numberInput}>
          <button onClick={decreaseDepth}>-</button>
          <span>{depth}</span>
          <button onClick={increaseDepth}>+</button>
        </div>
        <p>Choose your type:</p>
        <div>
          <button onClick={() => toggleZeroBasedIndex()}>
            {`${zeroBasedIndex ? "I'm a programmer" : "I'm a normal person"}`}
          </button>
        </div>
        <p>Columns will be labelled {zeroBasedIndex ? "0 to 6" : "1 to 7"}</p>

        <p>Let's Play!</p>
        <div className={styles.gameButtonHolder}>
          <button
            onClick={() => {
              resetGame();
              navigate({ to: "/classic" });
            }}
          >
            Classic Game
          </button>
          <button
            onClick={() => {
              resetGame();
              navigate({ to: "/blindfold" });
            }}
          >
            Blindfold Game
          </button>
        </div>
      </div>
    </div>
  );
};

export { Settings };
