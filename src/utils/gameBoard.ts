class GameBoard {
  static width = 7;
  static height = 6;
  history;
  height;
  moves;
  gameBoard;
  constructor(initHistory: string = "") {
    this.history = "";
    this.height = Array.from({ length: GameBoard.width }, () => 0);
    this.moves = 0;
    this.gameBoard = Array.from({ length: GameBoard.width }, () =>
      Array.from({ length: GameBoard.height }, () => 0)
    );
    this.initialiseGameBoard(initHistory);
  }

  initialiseGameBoard(initHistory: string) {
    for (let i = 0; i < initHistory.length; i++) {
      const col = Number(initHistory[i]) - 1;
      if (
        col < 0 ||
        col > GameBoard.width ||
        !this.canPlay(col) ||
        this.isWinningMove(col)
      ) {
        console.error(
          `invalid move in history: ${initHistory} error is ${initHistory[i]}`
        );
        return;
      }
      this.play(col);
    }
  }
  canPlay(col: number) {
    return this.height[col] < GameBoard.height;
  }
  isWinningMove(col: number) {
    const currentPlayer = 1 + (this.moves % 2);
    //vertical check
    if (
      this.height[col] > 2 &&
      this.gameBoard[col][this.height[col] - 1] === currentPlayer &&
      this.gameBoard[col][this.height[col] - 2] === currentPlayer &&
      this.gameBoard[col][this.height[col] - 3] === currentPlayer
    ) {
      return true;
    }
    //horizontal check
    let winCount = 0;
    for (const dx of [-1, 1]) {
      let curCol = col + dx;
      while (
        curCol >= 0 &&
        curCol < GameBoard.width &&
        this.gameBoard[curCol][this.height[col]] === currentPlayer
      ) {
        winCount++;
        curCol += dx;
      }
    }
    if (winCount >= 3) {
      return true;
    }
    //diagonal check positive
    winCount = 0;
    for (const dx of [-1, 1]) {
      let curCol = col + dx;
      let curHeight = this.height[col] + dx;
      while (
        curCol >= 0 &&
        curCol < GameBoard.width &&
        curHeight >= 0 &&
        curHeight < GameBoard.height &&
        this.gameBoard[curCol][curHeight] === currentPlayer
      ) {
        winCount++;
        curCol += dx;
        curHeight += dx;
      }
    }
    if (winCount >= 3) {
      return true;
    }
    //diagonal check negative
    winCount = 0;
    for (const dx of [-1, 1]) {
      let curCol = col + dx;
      let curHeight = this.height[col] - dx;
      while (
        curCol >= 0 &&
        curCol < GameBoard.width &&
        curHeight >= 0 &&
        curHeight < GameBoard.height &&
        this.gameBoard[curCol][curHeight] === currentPlayer
      ) {
        winCount++;
        curCol += dx;
        curHeight -= dx;
      }
    }
    if (winCount >= 3) {
      return true;
    }
    //TODO These 3 checks (or at least the diagonals) could be refactored into a loop (DRY)
    return false;
  }

  play(col: number) {
    this.gameBoard[col][this.height[col]] = 1 + (this.moves % 2);
    this.height[col]++;
    this.moves++;
    this.history = `${this.history}${(col + 1).toString()}`;
  }

  unplay(col: number) {
    this.gameBoard[col][this.height[col] - 1] = 0;
    this.height[col]--;
    this.moves--;
    this.history = this.history.slice(0, this.history.length - 1);
  }

  printBoard() {
    for (let i = GameBoard.height; i >= 0; i--) {
      let printRow = [];
      for (let j = 0; j < GameBoard.width; j++) {
        printRow.push(this.gameBoard[j][i]);
      }
      console.log(printRow.join(""));
    }
  }
}

export { GameBoard };
