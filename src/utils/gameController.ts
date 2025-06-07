import { GameBoard } from "./gameBoard";
import { moveFinder } from "./moveFinder";

class GameController {
  gameBoard: GameBoard;
  depth: number;
  constructor(moveHistory: string = "", depth: number = 4) {
    this.gameBoard = new GameBoard(moveHistory);
    this.depth = depth;
  }

  playColumn(col: number) {
    this.gameBoard.playColumn(col);
    const moveOptions = moveFinder(this.gameBoard, this.depth);
    let bestMove = 0;
    let bestScore = -Infinity;
    moveOptions.forEach((curScore, curIndex) => {
      if (curScore !== null && curScore >= bestScore) {
        bestMove = curIndex;
        bestScore = curScore;
      }
    });
    console.log(
      `player chose ${col}/ncomputer chooses ${bestMove} scoring ${bestScore}`
    );
    this.gameBoard.printPosition();
    this.gameBoard.playColumn(bestMove);
    //return object with player and computer last move (col, height) - maybe just as location data
  }
}
