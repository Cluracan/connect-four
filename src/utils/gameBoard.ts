/**
 * A class storing a Connect 4 position.
 * Functions are relative to the current player to play.
 *
 * A binary bitboard representation is used.
 * Each column is encoded on HEIGHT+1 bits.
 *
 * Bit order to encode for a 7x6 board
 * .  .  .  .  .  .  .
 * 5 12 19 26 33 40 47
 * 4 11 18 25 32 39 46
 * 3 10 17 24 31 38 45
 * 2  9 16 23 30 37 44
 * 1  8 15 22 29 36 43
 * 0  7 14 21 28 35 42
 *
 * Position is stored as
 * - a bitboard "mask" with 1 on any color stones
 * - a bitboard "current_player" with 1 on stones of current player
 *
 * "current_player" bitboard can be transformed into a compact and non ambiguous key
 * by adding an extra bit on top of the last non empty cell of each column.
 * This allow to identify all the empty cells whithout needing "mask" bitboard
 *
 * current_player "x" = 1, opponent "o" = 0
 * board     position  mask      key       bottom
 *           0000000   0000000   0000000   0000000
 * .......   0000000   0000000   0001000   0000000
 * ...o...   0000000   0001000   0010000   0000000
 * ..xx...   0011000   0011000   0011000   0000000
 * ..ox...   0001000   0011000   0001100   0000000
 * ..oox..   0000100   0011100   0000110   0000000
 * ..oxxo.   0001100   0011110   1101101   1111111
 *
 * current_player "o" = 1, opponent "x" = 0
 * board     position  mask      key       bottom
 *           0000000   0000000   0001000   0000000
 * ...x...   0000000   0001000   0000000   0000000
 * ...o...   0001000   0001000   0011000   0000000
 * ..xx...   0000000   0011000   0000000   0000000
 * ..ox...   0010000   0011000   0010100   0000000
 * ..oox..   0011000   0011100   0011010   0000000
 * ..oxxo.   0010010   0011110   1110011   1111111
 *
 * key is an unique representation of a board key = position + mask + bottom
 * in practice, as bottom is constant, key = position + mask is also a
 * non-ambigous representation of the position.
 */

/**
 * Generate a bitmask containing one for the bottom slot of each colum
 * must be defined outside of the class definition to be available at compile time for bottom_mask
 * recursive fn where height+1 creates the 7-step in positions and you push (OR) single 1's into the value
 */
const generateBottomMask = (width: number, height: number): bigint => {
  return width === 0
    ? 0n
    : generateBottomMask(width - 1, height) |
        (1n << BigInt((width - 1) * (height + 1)));
};

class GameBoard {
  static width = 7;
  static height = 6;
  static size = this.width * this.height;

  mask: bigint;
  bottomMask: bigint;
  boardMask: bigint;
  currentPosition: bigint;
  moveCount: number;
  constructor(moveInput: string = "") {
    this.mask = 0n;
    this.currentPosition = 0n;
    this.bottomMask = generateBottomMask(GameBoard.width, GameBoard.height);
    this.boardMask = this.bottomMask * ((1n << BigInt(GameBoard.height)) - 1n);
    this.moveCount = 0;
    this.initialiseBoard(moveInput);
  }
  // return a bitmask 1 on all the cells of a given column
  columnMask = (col: number) => {
    return (
      ((1n << BigInt(GameBoard.height)) - 1n) <<
      BigInt(col * (GameBoard.height + 1))
    );
  };
  //return a bitmask containg a single 1 corresponding to the top cell of a given column
  columnTopMask = (col: number) => {
    return 1n << BigInt(GameBoard.height - 1 + col * (GameBoard.height + 1));
  };
  // return a bitmask containg a single 1 corresponding to the bottom cell of a given column
  columnBottomMask = (col: number) => {
    return 1n << BigInt(col * (GameBoard.height + 1));
  };

  canPlay(col: number) {
    return (this.mask & this.columnTopMask(col)) === 0n;
  }

  // Indicates whether the current player wins by playing a given column.
  isWinningColumn(col: number) {
    return (
      (this.playerWinningPositions() &
        this.possibleMoves() &
        this.columnMask(col)) !==
      0n
    );
  }

  //This function should not be called on a non-playable column or a winning column.
  playColumn(col: number) {
    let move = (this.mask + this.columnBottomMask(col)) & this.columnMask(col);
    //extra bit carries all the way to the top of that column, like 99999 + 1 (except in base 2)
    this.playMove(move);
  }

  playMove(move: bigint) {
    this.currentPosition ^= this.mask;
    this.mask |= move;
    this.moveCount++;
  }

  undoMove(move: bigint) {
    this.mask ^= move;
    this.currentPosition ^= this.mask;
    this.moveCount--;
  }

  //TODO - alter to 0 based once testing done?
  //moveInput is a 1 - based index of the board (for testing)
  initialiseBoard(moveInput: string) {
    for (let i = 0; i < moveInput.length; i++) {
      let col = parseInt(moveInput[i]) - 1;
      if (
        col < 0 ||
        col > GameBoard.width - 1 ||
        !this.canPlay(col) ||
        this.isWinningColumn(col)
      ) {
        console.error(
          `Error in initial input string ${moveInput} at ${moveInput[i]}`
        );
        break;
      }
      this.playColumn(col);
    }
  }

  possibleMoves() {
    return (this.mask + this.bottomMask) & this.boardMask;
  }

  //helper fn returns a bitmap of all cells that could connect-4 for a given position (may not be reachable)
  getWinningPositions(position: bigint, mask: bigint) {
    //vertical
    let winningPositions =
      (position << 1n) & (position << 2n) & (position << 3n);

    //horzontal & diagonal (DRY)
    //height    : Diagonal 2 \
    //height + 1: Horizontal -
    //height + 2: Diagonal 1 /
    for (const shift of [
      BigInt(GameBoard.height),
      BigInt(GameBoard.height + 1),
      BigInt(GameBoard.height + 2),
    ]) {
      //  XXX.
      winningPositions |=
        (position << shift) &
        (position << (2n * shift)) &
        (position << (3n * shift));
      //  XX.X
      winningPositions |=
        (position << shift) & (position << (2n * shift)) & (position >> shift);
      //  X.XX
      winningPositions |=
        (position << shift) &
        (position >> (2n * shift)) &
        (position >> (3n * shift));
      //  .XXX
      winningPositions |=
        (position >> shift) &
        (position >> (2n * shift)) &
        (position >> (3n * shift));
    }
    return winningPositions & (this.boardMask ^ mask);
  }

  //Return a bitmask of the possible winning positions for the current player (may not be reachable)
  playerWinningPositions() {
    return this.getWinningPositions(this.currentPosition, this.mask);
  }

  //Return a bitmask of the possible winning positions for the opponent (may not be reachable)
  opponentWinningPositions() {
    return this.getWinningPositions(
      this.mask ^ this.currentPosition,
      this.mask
    );
  }

  playerWinningMoves() {
    return this.playerWinningPositions() & this.possibleMoves();
  }
  // returns current winning moves (which can then be blocked by curplayer)
  opponentWinningMoves() {
    return this.opponentWinningPositions() & this.possibleMoves();
  }
  //to help with debugging 'X' is current player so about to move
  printPosition() {
    const curPlayer = this.currentPosition
      .toString(2)
      .split("")
      .reverse()
      .join("");
    const opponent = (this.mask ^ this.currentPosition)
      .toString(2)
      .split("")
      .reverse()
      .join("");
    let boardArray = Array.from({ length: GameBoard.height + 1 }, () =>
      Array.from({ length: GameBoard.width }, () => ".")
    );
    for (let i = 0; i < GameBoard.width; i++) {
      for (let j = 0; j < GameBoard.height + 1; j++) {
        let curIndex = j + i * (GameBoard.height + 1);
        if (curPlayer[curIndex] === "1") {
          boardArray[j][i] = "X";
        } else if (opponent[curIndex] === "1") {
          boardArray[j][i] = "O";
        }
      }
    }
    boardArray.reverse();
    boardArray.forEach((row) => console.log(...row));
    console.log("\nX to play");
  }

  //Evaluate a board

  //helper fn to count cells
  bitCount(position: bigint) {
    let count = 0;
    while (position > 0) {
      if (position & 1n) {
        count++;
      }
      position >>= 1n;
    }
    return count;
  }

  getEvaluation() {
    //draw (if following a forced line)
    if (this.bitCount(this.possibleMoves()) === 0) {
      return 0;
    }
    //player win
    if (this.bitCount(this.playerWinningMoves()) !== 0) {
      return Infinity;
    }
    //opponent win (forced)
    if (this.bitCount(this.opponentWinningMoves()) > 1) {
      return -Infinity;
    }
    //follow a forced line
    let forcedMove = 0n;
    if (this.bitCount(this.possibleMoves()) === 1) {
      console.log("only 1 available move");
      forcedMove = this.possibleMoves();
    } else if (this.bitCount(this.opponentWinningMoves()) === 1) {
      console.log("must block opponent");
      console.log(this.opponentWinningMoves());
      forcedMove = this.opponentWinningMoves();
    }
    if (forcedMove > 0n) {
      this.playMove(forcedMove);
      let score: number = -this.getEvaluation();
      this.undoMove(forcedMove);
      return score;
    }

    return (
      this.evaluatePosition(this.currentPosition) -
      this.evaluatePosition(this.mask ^ this.currentPosition)
    );
  }

  evaluatePosition(position: bigint) {
    const blankSpace = this.boardMask ^ this.mask;
    let twoCount = 0;
    //count two stones that could be fours
    //vertical
    let verticalMask =
      (position << 1n) & (position << 2n) & (blankSpace & (blankSpace >> 1n));
    twoCount += this.bitCount(verticalMask);
    console.log({ vert: this.bitCount(verticalMask) });

    //horzontal & diagonal (DRY)
    /*  
    height    : Diagonal 2 \
    height + 1: Horizontal -
    height + 2: Diagonal 1 /
    */
    for (const shift of [
      BigInt(GameBoard.height),
      BigInt(GameBoard.height + 1),
      BigInt(GameBoard.height + 2),
    ]) {
      console.log(
        `${
          shift === BigInt(GameBoard.height)
            ? "Diagonal \\"
            : shift === BigInt(GameBoard.height + 1)
            ? "Horizontal"
            : "Diagonal /"
        }`
      );
      // XX..
      let fourMatch =
        (position << shift) &
        (position << (2n * shift)) &
        (blankSpace & (blankSpace >> shift));
      twoCount += this.bitCount(fourMatch);
      console.log({ matchRight: this.bitCount(fourMatch) });
      //..XX
      fourMatch =
        (position >> shift) &
        (position >> (2n * shift)) &
        (blankSpace & (blankSpace << shift));
      twoCount += this.bitCount(fourMatch);
      console.log({ matchLeft: this.bitCount(fourMatch) });
      // .X.X. (test L/R ends individually)
      let XOXmask = (position << shift) & (position >> shift) & blankSpace;
      fourMatch = XOXmask & (blankSpace << (2n * shift));
      twoCount += this.bitCount(fourMatch);
      console.log({ matchOXOX: this.bitCount(fourMatch) });
      fourMatch = XOXmask & (blankSpace >> (2n * shift));
      twoCount += this.bitCount(fourMatch);
      console.log({ matchXOXO: this.bitCount(fourMatch) });
      //X..X
      fourMatch =
        position &
        (position << (3n * shift)) &
        ((blankSpace << shift) & (blankSpace << (2n * shift)));
      twoCount += this.bitCount(fourMatch);
      console.log({ matchXOOX: this.bitCount(fourMatch) });
      //.XX.
      fourMatch =
        (position << shift) &
        (position << (2n * shift)) &
        (blankSpace & (blankSpace << (3n * shift)));
      twoCount += this.bitCount(fourMatch);
      console.log({ matchOXXO: this.bitCount(fourMatch) });
    }
    let threeCount = this.bitCount(
      this.getWinningPositions(position, this.mask)
    );
    console.log({ threeCount });

    return threeCount ** 2 + twoCount;
  }
}

const test = new GameBoard("23163416124767223154467471272416755633");
test.printPosition();
// test.playColumn(6);
// test.printPosition();
console.log(test.getEvaluation());
export { GameBoard };

/*
   let twoMatch =
      (position << BigInt(GameBoard.height + 1)) &
      (position << BigInt(2 * (GameBoard.height + 1)));
    // match ...x
    winningPositions |=
      twoMatch & (position << BigInt(3 * (GameBoard.height + 1)));
    console.log(`h ...x ${winningPositions & this.possibleMoves()}`);
    // match ..x.
    winningPositions |= twoMatch & (position >> BigInt(GameBoard.height + 1));
    console.log(`h ..x. ${winningPositions & this.possibleMoves()}`);
    //horizontal (check left)
    twoMatch =
      (position >> BigInt(GameBoard.height + 1)) &
      (position >> BigInt(2 * (GameBoard.height + 1)));
    //match x...
    winningPositions |=
      twoMatch & (position >> BigInt(3 * (GameBoard.height + 1)));
    console.log(`h x... ${winningPositions & this.possibleMoves()}`);
    //match .x..
    winningPositions |= twoMatch & (position << BigInt(GameBoard.height + 1));
    console.log(`h .x.. ${winningPositions & this.possibleMoves()}`);
    //diagonal 1
    twoMatch =
      (position << BigInt(GameBoard.height)) &
      (position << BigInt(2 * GameBoard.height));
    // match ...x
    winningPositions |= twoMatch & (position << BigInt(3 * GameBoard.height));
    // match ..x.
    winningPositions |= twoMatch & (position >> BigInt(GameBoard.height));
    //horizontal (check left)
    twoMatch =
      (position >> BigInt(GameBoard.height)) &
      (position >> BigInt(2 * GameBoard.height));
    //match x...
    winningPositions |= twoMatch & (position >> BigInt(3 * GameBoard.height));
    //match .x..
    winningPositions |= twoMatch & (position << BigInt(GameBoard.height));
    console.log(`diag ${winningPositions & this.possibleMoves()}`);
    //diagonal 2
    twoMatch =
      (position << BigInt(GameBoard.height + 2)) &
      (position << BigInt(2 * (GameBoard.height + 2)));
    // match ...x
    winningPositions |=
      twoMatch & (position << BigInt(3 * (GameBoard.height + 2)));
    // match ..x.
    winningPositions |= twoMatch & (position >> BigInt(GameBoard.height + 2));
    //horizontal (check left)
    twoMatch =
      (position >> BigInt(GameBoard.height + 1)) &
      (position >> BigInt(2 * (GameBoard.height + 2)));
    //match x...
    winningPositions |=
      twoMatch & (position >> BigInt(3 * (GameBoard.height + 2)));
    //match .x..
    winningPositions |= twoMatch & (position << BigInt(GameBoard.height + 2));
    console.log(`diag ${winningPositions & this.possibleMoves()}`);
*/
