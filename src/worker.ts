import { negamax } from "./utils/negamax";
import { GameBoard } from "./utils/gameBoard";

self.onmessage = (e) => {
  switch (e.data.action) {
    case "find":
      const gameBoard = new GameBoard();
      for (const move of e.data.moveHistory) {
        gameBoard.playColumn(move);
      }
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
          moveArray[i] = -negamax(gameBoard, e.data.depth, -Infinity, Infinity);
          gameBoard.undoMove(move);
        }
      }

      let bestMove = 0;
      let bestScore = -Infinity;
      moveArray.forEach((curScore, curIndex) => {
        if (curScore !== null && curScore >= bestScore) {
          bestMove = curIndex;
          bestScore = curScore;
        }
      });

      postMessage({ bestMove });
      break;
    default:
      console.log(e.data);
      self.postMessage("hello from worker");
  }
};
