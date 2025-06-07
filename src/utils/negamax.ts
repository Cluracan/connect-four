import { GameBoard } from "./gameBoard";
import { TranspostitionTable } from "./transpositionTable";
const transpositionTable = new TranspostitionTable();
const moveOrder = [3, 2, 4, 1, 5, 0, 6];
//TODO transpositiontable gets sent as argument from some main page I think?
//TODO put moveOrder somewhere sensible? Or set generic to tie in with GameBoard.width etc

const negamax = (
  gameBoard: GameBoard,
  depth: number,
  alpha: number,
  beta: number
) => {
  const alphaOrig = alpha;
  if (gameBoard.drawnGame()) {
    return 0;
  }
  if (gameBoard.playerForcedWin()) {
    return Infinity;
  }
  if (gameBoard.opponentForcedWin()) {
    return -Infinity;
  }
  let ttEntry = transpositionTable.get(gameBoard.key());
  if (ttEntry !== undefined) {
    switch (ttEntry.flag) {
      case "EXACT":
        return ttEntry.value;
      case "LOWERBOUND":
        if (ttEntry.value >= beta) {
          return ttEntry.value;
        }
        break;
      case "UPPERBOUND":
        if (ttEntry.value <= alpha) {
          return ttEntry.value;
        }
    }
  }
  if (depth === 0) {
    return gameBoard.getEvaluation() || 0;
  }
  let score = -Infinity;
  for (const col of moveOrder) {
    let nextMove = gameBoard.possibleMoves() & gameBoard.columnMask(col);
    if (nextMove > 0n) {
      gameBoard.playMove(nextMove);
      score = Math.max(score, -negamax(gameBoard, depth - 1, -beta, -alpha));
      alpha = Math.max(alpha, score);
      gameBoard.undoMove(nextMove);
      if (alpha > beta) break;
    }
  }
  if (score <= alphaOrig) {
    transpositionTable.set(gameBoard.key(), {
      flag: "UPPERBOUND",
      depth: depth,
      value: score,
    });
  } else if (score >= beta) {
    transpositionTable.set(gameBoard.key(), {
      flag: "LOWERBOUND",
      depth: depth,
      value: score,
    });
  } else {
    transpositionTable.set(gameBoard.key(), {
      flag: "EXACT",
      depth: depth,
      value: score,
    });
  }
  return score || 0;
};

export { negamax };
