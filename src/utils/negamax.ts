import { GameBoard } from "./gameBoard";

/**
 * Reccursively score connect 4 position using negamax variant of alpha-beta algorithm.
 * https://www.chessprogramming.org/Alpha-Beta
 * @return the exact score, an upper or lower bound score depending of the case:
 */

const negamax = (position: GameBoard, alpha: number, beta: number) => {
  if (position.moves === GameBoard.height * GameBoard.width) {
    //check for drawn game
    return 0;
  }

  for (let col = 0; col < GameBoard.width; col++) {
    //check if current player can win next move
    if (position.canPlay(col) && position.isWinningMove(col)) {
      return Math.floor(
        (GameBoard.width * GameBoard.height + 1 - position.moves) / 2
      );
    }
  }

  let maxScore = Math.floor(
    //upper bound of our score (max possible score this turn)
    (GameBoard.width * GameBoard.height + 1 - position.moves) / 2
  );

  if (beta > maxScore) {
    beta = maxScore; //beta (best case score can't be greater than this)
    if (alpha > beta) return beta; //if [alpha,beta] window is empty, prune exploration
  }

  for (const col of [3, 2, 4, 1, 5, 0, 6]) {
    if (position.canPlay(col)) {
      position.play(col);

      let score: number = -negamax(position, -beta, -alpha);
      if (score >= beta) {
        position.unplay(col);
        return score;
      }
      if (score > alpha) {
        alpha = score;
      }
      position.unplay(col);
    }
  }
  return alpha | 0;
};

export { negamax };

// const testBoard = new GameBoard("2252576253462244111563365343671351441");

// console.log(negamax(testBoard, -Infinity, Infinity));
