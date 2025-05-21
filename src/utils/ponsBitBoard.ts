class PonsBitBoard {
  static width = 7;
  static height = 6;
  static min_score = -(this.width * this.height) / 2 + 3;
  static max_score = Math.floor((this.width * this.height + 1) / 2 - 3);
  current_position: bigint;
  mask: bigint;
  moves: number;
  constructor(initialMoveHistory: string = "") {
    this.current_position = 0n;
    this.mask = 0n;
    this.moves = 0;
    this.initialiseBoard(initialMoveHistory);
  }

  top_mask(col: number) {
    return (
      (1n << BigInt(PonsBitBoard.height - 1)) <<
      (BigInt(col) * BigInt(PonsBitBoard.height + 1))
    );
  }

  bottom_mask(col: number) {
    return 1n << (BigInt(col) * BigInt(PonsBitBoard.height + 1));
  }

  column_mask(col: number) {
    return (
      ((1n << BigInt(PonsBitBoard.height)) - 1n) <<
      (BigInt(col) * BigInt(PonsBitBoard.height + 1))
    );
  }

  alignment(pos: bigint) {
    let m = pos & (pos >> BigInt(PonsBitBoard.height + 1));
    if (m & (m >> (2n * BigInt(PonsBitBoard.height + 1)))) return true;

    m = pos & (pos >> BigInt(PonsBitBoard.height));
    if (m & (m >> (2n * BigInt(PonsBitBoard.height)))) return true;

    m = pos & (pos >> BigInt(PonsBitBoard.height + 2));
    if (m & (m >> (2n * BigInt(PonsBitBoard.height + 2)))) return true;

    m = pos & (pos >> 1n);
    if (m & (m >> 2n)) return true;

    return false;
  }

  isWinningMove(col: number) {
    let pos = this.current_position;
    pos |= (this.mask + this.bottom_mask(col)) & this.column_mask(col);
    return this.alignment(pos);
  }

  key() {
    return this.current_position + this.mask;
  }

  play(col: number) {
    this.current_position ^= this.mask;
    this.mask |= this.mask + this.bottom_mask(col);
    this.moves++;
  }

  canPlay(col: number) {
    return (this.mask & this.top_mask(col)) === 0n;
  }

  nbMoves() {
    return this.moves;
  }

  initialiseBoard(seq: string) {
    for (let i = 0; i < seq.length; i++) {
      let col = parseInt(seq[i]) - 1;
      if (
        col < 0 ||
        col > PonsBitBoard.width ||
        !this.canPlay(col) ||
        this.isWinningMove(col)
      )
        return i;
      this.play(col);
    }
  }

  clone() {
    let clonedBoard = new PonsBitBoard();
    clonedBoard.moves = this.moves;
    clonedBoard.mask = this.mask;
    clonedBoard.current_position = this.current_position;
    return clonedBoard;
  }
}

// const testBoard = new PonsBitBoard("112233");
// console.log(testBoard);
// for (let i = 0; i < 7; i++) {
//   if (testBoard.canPlay(i)) {
//     console.log(testBoard.isWinningMove(i));
//   }
// }
// let checkBoard = testBoard.clone();
// console.log(checkBoard);
// testBoard.play(6);
// console.log(testBoard);
// checkBoard.play(6);
// console.log(checkBoard);

// testBoard.printBoards();
export { PonsBitBoard };
