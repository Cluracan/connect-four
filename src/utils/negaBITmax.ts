import { GameBitBoard } from "./gameBitBoard";

/**
 * Reccursively score connect 4 position using negamax variant of alpha-beta algorithm.
 * https://www.chessprogramming.org/Alpha-Beta
 * @return the exact score, an upper or lower bound score depending of the case:
 */

const transpositionTable = new Map();

const negaBITmax = (position: GameBitBoard, alpha: number, beta: number) => {
  if (position.moveCounter === GameBitBoard.height * GameBitBoard.width) {
    //check for drawn game
    return 0;
  }

  for (let col = 0; col < GameBitBoard.width; col++) {
    //check if current player can win next move
    if (position.canMove(col) && position.isWinningMove(col)) {
      return Math.floor(
        (GameBitBoard.totalMoves - position.moveCounter + 1) / 2
      );
    }
  }

  let maxScore = Math.floor(
    //upper bound of our score (max possible score this turn)
    (GameBitBoard.totalMoves + 1 - position.moveCounter) / 2
  );

  if (transpositionTable.has(position.hashBoard())) {
    maxScore = Math.floor(
      transpositionTable.get(position.hashBoard()) + GameBitBoard.minScore - 1
    );
  }

  if (beta > maxScore) {
    beta = maxScore; //beta (best case score can't be greater than this)
    if (alpha > beta) return beta; //if [alpha,beta] window is empty, prune exploration
  }

  for (const col of [3, 2, 4, 1, 5, 0, 6]) {
    if (position.canMove(col)) {
      position.makeMove(col);

      let score: number = -negaBITmax(position, -beta, -alpha);
      if (score >= beta) {
        position.undoMove(col);
        return score;
      }
      if (score > alpha) {
        alpha = score;
      }
      position.undoMove(col);
    }
  }
  transpositionTable.set(
    position.hashBoard(),
    alpha - GameBitBoard.minScore + 1
  );
  return alpha | 0;
};

export { negaBITmax };

// const testBoard = new GameBitBoard("2252576253462244111563365343671351441");

// console.log(negaBITmax(testBoard, -Infinity, Infinity));
