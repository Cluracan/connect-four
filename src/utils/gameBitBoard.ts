// https://github.com/denkspuren/BitboardC4/blob/master/BitboardDesign.md

class GameBitBoard {
  static width = 7;
  static height = 6;
  moveHistory: number[];
  moveCounter: number;
  gameBitBoard: bigint[];
  height: number[];

  constructor(initialMoveHistory: string = "") {
    this.moveHistory = [];
    this.moveCounter = 0;
    this.gameBitBoard = [0n, 0n];
    this.height = [0, 7, 14, 21, 28, 35, 42];
    this.initialiseGameBitBoard(initialMoveHistory);
  }

  canMove(col: number) {
    return this.height[col] % 7 < GameBitBoard.height;
  }

  makeMove(col: number) {
    const move: bigint = 1n << BigInt(this.height[col]);
    this.gameBitBoard[this.moveCounter & 1] ^= move;
    this.height[col]++;
    this.moveCounter++;
    this.moveHistory.push(col);
  }

  undoMove(col: number) {
    this.moveHistory.pop();
    this.height[col]--;
    this.moveCounter--;
    const move: bigint = 1n << BigInt(this.height[col]);
    this.gameBitBoard[this.moveCounter & 1] ^= move;
  }

  isWinningMove(col: number) {
    let nextBitBoard = this.gameBitBoard[this.moveCounter & 1];
    const move: bigint = 1n << BigInt(this.height[col]);
    nextBitBoard ^= move;
    const directions: bigint[] = [1n, 7n, 6n, 8n];
    for (const direction of directions) {
      if (
        (nextBitBoard &
          (nextBitBoard >> direction) &
          (nextBitBoard >> (2n * direction)) &
          (nextBitBoard >> (3n * direction))) !=
        0n
      ) {
        return true;
      }
    }
    return false;
  }

  initialiseGameBitBoard(initialMoveHistory: string) {
    for (let i = 0; i < initialMoveHistory.length; i++) {
      this.makeMove(parseInt(initialMoveHistory[i]) - 1);
    }
  }

  printBoards() {
    this.gameBitBoard.forEach((board, index) => {
      let boardHolder = Array.from({ length: 7 }, () =>
        Array.from({ length: 7 }, () => ".")
      );
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          boardHolder[6 - j][i] = (board & 1n).toString();
          board = board >> 1n;
        }
      }
      boardHolder.forEach((row) => console.log(...row));
      console.log(`\n player ${index}\n`);
    });
  }
}

// const testBoard = new GameBitBoard("524653332256623414472524557673341711667");
// for (let i = 0; i < 7; i++) {
//   if (testBoard.canMove(i)) {
//     console.log(testBoard.isWinningMove(i));
//   }
// }
// testBoard.printBoards();
export { GameBitBoard };
