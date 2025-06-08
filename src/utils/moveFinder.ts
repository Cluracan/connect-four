import { negamax } from "./negamax";
import { GameBoard } from "./gameBoard";

const moveFinder = (gameBoard: GameBoard, depth: number) => {
  let moveArray: Array<number | null> = Array.from(
    { length: GameBoard.width },
    () => null
  );
  //take only winning moves if there are any, otherwise consider all possible moves (could also go to opponent winning moves but negamax will find these quickly enough)
  let potentialMoves =
    gameBoard.playerWinningMoves() || gameBoard.possibleMoves();
  for (let i = 0; i < GameBoard.width; i++) {
    let move = potentialMoves & gameBoard.columnMask(i);
    if (move !== 0n) {
      gameBoard.playMove(move);
      moveArray[i] = -negamax(gameBoard, depth, -Infinity, Infinity);
      gameBoard.undoMove(move);
    }
  }
  return moveArray;
};

export { moveFinder };

//TODO: create array of viable moves and choose randomly from them?  (Currently choose last one of equal scores)
