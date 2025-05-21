import { PonsBitBoard } from "./ponsBitBoard";
const transpositionTable = new Map();

const ponsNegamax = (position: PonsBitBoard, alpha: number, beta: number) => {
  if (position.nbMoves() === PonsBitBoard.height * PonsBitBoard.width) {
    //check for drawn game
    return 0;
  }

  for (let col = 0; col < PonsBitBoard.width; col++) {
    //check if current player can win next move
    if (position.canPlay(col) && position.isWinningMove(col)) {
      return Math.floor(
        (PonsBitBoard.width * PonsBitBoard.height + 1 - position.nbMoves()) / 2
      );
    }
  }

  let maxScore = Math.floor(
    //upper bound of our score (max possible score this turn)
    (PonsBitBoard.width * PonsBitBoard.height + 1 - position.nbMoves()) / 2
  );

  if (transpositionTable.has(position.key())) {
    maxScore =
      transpositionTable.get(position.current_position) +
      PonsBitBoard.min_score -
      1;
  }

  if (beta > maxScore) {
    beta = maxScore; //beta (best case score can't be greater than this)
    if (alpha > beta) return beta; //if [alpha,beta] window is empty, prune exploration
  }

  for (const col of [3, 2, 4, 1, 5, 0, 6]) {
    if (position.canPlay(col)) {
      let position2 = position.clone();
      position2.play(col);

      let score: number = -ponsNegamax(position2, -beta, -alpha);
      if (score >= beta) {
        return score;
      }
      if (score > alpha) {
        alpha = score;
      }
    }
  }
  transpositionTable.set(position.key(), alpha - PonsBitBoard.min_score + 1);
  return alpha | 0;
};

const ponsSolve = (position: PonsBitBoard) => {
  let min = -Math.floor(
    PonsBitBoard.width * PonsBitBoard.height - position.nbMoves() / 2
  );
  let max =
    Math.floor(
      PonsBitBoard.width * PonsBitBoard.height + 1 - position.nbMoves()
    ) / 2;
  while (min < max) {
    let med = Math.floor(min + (max - min) / 2);
    if (med <= 0 && min / 2 < med) {
      med = Math.ceil(min / 2);
    } else if (med >= 0 && max / 2 > med) {
      med = Math.floor(max / 2);
    }
    let r = Math.floor(ponsNegamax(position, med, med + 1)) | 0;

    if (r <= med) {
      max = r;
    } else {
      min = r;
    }
  }
  return min;
};

export { ponsNegamax, ponsSolve };
