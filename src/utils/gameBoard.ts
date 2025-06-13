// Derived from Pascal Pons connect four blog - a few weeks to get my head round it then implemented this version

import {
  GAMEBOARD_HEIGHT,
  GAMEBOARD_WIDTH,
  HUMAN_COLOUR,
  COMPUTER_COLOUR,
} from "../constants";
import type { LocationData } from "../types/gameBoard.types";

const generateBottomMask = (width: number, height: number): bigint => {
  return width === 0
    ? 0n
    : generateBottomMask(width - 1, height) |
        (1n << BigInt((width - 1) * (height + 1)));
};

class GameBoard {
  static width = GAMEBOARD_WIDTH;
  static height = GAMEBOARD_HEIGHT;
  static size = this.width * this.height;

  mask: bigint;
  bottomMask: bigint;
  boardMask: bigint;
  currentPosition: bigint;
  moveCount: number;
  moveHistory: number[];
  constructor(moveInput: string = "") {
    this.mask = 0n;
    this.currentPosition = 0n;
    this.bottomMask = generateBottomMask(GameBoard.width, GameBoard.height);
    this.boardMask = this.bottomMask * ((1n << BigInt(GameBoard.height)) - 1n);
    this.moveCount = 0;
    this.moveHistory = moveInput.split("").map(Number);
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

  key = () => {
    return this.currentPosition + this.mask;
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
    this.moveHistory.push(col);
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
        if (!this.canPlay(col)) {
          console.log("Cannot play col");
        }
        if (this.isWinningColumn(col)) {
          console.log(`Col ${col} is winning`);
        }

        break;
      }
      this.playColumn(col);
    }
  }

  resetBoard() {
    this.mask = 0n;
    this.currentPosition = 0n;
    this.bottomMask = generateBottomMask(GameBoard.width, GameBoard.height);
    this.boardMask = this.bottomMask * ((1n << BigInt(GameBoard.height)) - 1n);
    this.moveCount = 0;
    this.moveHistory = [];
  }

  possibleMoves() {
    return (this.mask + this.bottomMask) & this.boardMask;
  }

  //helper fn returns a bitmap of all cells that could connect-4 for a given position (may not be reachable)
  getWinningPositions(position: bigint, mask: bigint) {
    let blankSpace = this.boardMask ^ this.mask;
    //vertical
    let winningPositions =
      (position << 1n) & (position << 2n) & (position << 3n) & blankSpace;

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
        ((position << (3n * shift)) & blankSpace);
      // if (winningPositions !== 0n) {
      //   console.log(position.toString(2));
      //   console.log(
      //     ((position << shift) & (position << (2n * shift))).toString(2)
      //   );
      //   console.log(
      //     `win 1 on ${
      //       shift === 6n
      //         ? "diag /"
      //         : shift === 7n
      //         ? "horiz"
      //         : shift === 8n
      //         ? "diag \\"
      //         : "oops"
      //     }`
      //   );
      //   console.log((winningPositions & this.possibleMoves()).toString(2));
      // }
      //  XX.X
      winningPositions |=
        (position << shift) &
        (position << (2n * shift)) &
        (position >> shift) &
        blankSpace;
      // if (winningPositions !== 0n) {
      //   console.log(
      //     `win 2 on ${
      //       shift === 6n
      //         ? "diag /"
      //         : shift === 7n
      //         ? "horiz"
      //         : shift === 8n
      //         ? "diag \\"
      //         : "oops"
      //     }`
      //   );
      // }
      //  X.XX
      winningPositions |=
        (position << shift) &
        (position >> shift) &
        ((position >> (2n * shift)) & blankSpace);
      // if (winningPositions !== 0n) {
      //   console.log(
      //     `win 3 on ${
      //       shift === 6n
      //         ? "diag /"
      //         : shift === 7n
      //         ? "horiz"
      //         : shift === 8n
      //         ? "diag \\"
      //         : "oops"
      //     }`
      //   );
      // }
      //  .XXX
      winningPositions |=
        (position >> shift) &
        (position >> (2n * shift)) &
        (position >> (3n * shift)) &
        blankSpace;
      // if (winningPositions !== 0n) {
      //   console.log(
      //     `win 4 on ${
      //       shift === 6n
      //         ? "diag /"
      //         : shift === 7n
      //         ? "horiz"
      //         : shift === 8n
      //         ? "diag \\"
      //         : "oops"
      //     }`
      //   );
      // }
    }
    // console.log(
    //   `getWinningPositions returns ${(
    //     winningPositions &
    //     (this.boardMask ^ mask)
    //   ).toString(2)}`
    // );
    return winningPositions & (this.boardMask ^ mask);
  }

  //Return a bitmask of the possible winning positions for the current player (may not be reachable)
  playerWinningPositions() {
    return this.getWinningPositions(this.currentPosition, this.mask);
  }

  // returns currently-playable winning moves
  playerWinningMoves() {
    return this.playerWinningPositions() & this.possibleMoves();
  }

  playerForcedWin() {
    return this.bitCount(this.playerWinningMoves()) !== 0;
  }

  //Return a bitmask of the possible winning positions for the opponent (may not be reachable)
  opponentWinningPositions() {
    return this.getWinningPositions(
      this.mask ^ this.currentPosition,
      this.mask
    );
  }

  // returns currently-playable opponent winning moves (which can then be blocked by curplayer)
  opponentWinningMoves() {
    return this.opponentWinningPositions() & this.possibleMoves();
  }

  //opponent must have 2 distinct wins so curPlayer can't block
  opponentForcedWin() {
    return this.bitCount(this.opponentWinningMoves()) > 1;
  }

  drawnGame() {
    return this.possibleMoves() === 0n;
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

  //Return set of stone locations
  getLocationData() {
    let locationData: LocationData = [];
    let colHeight = Array.from({ length: GameBoard.width }, () => 0);
    this.moveHistory.forEach((col, index) => {
      locationData.push({
        height: colHeight[col],
        col,
        colour: index % 2 === 0 ? HUMAN_COLOUR : COMPUTER_COLOUR,
      });
      colHeight[col]++;
    });

    return locationData;
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
    if (this.drawnGame()) {
      return 0;
    }
    if (this.playerForcedWin()) {
      return Infinity;
    }
    if (this.opponentForcedWin()) {
      return -Infinity;
    }
    //check for a forced line
    let forcedMove = 0n;
    if (this.bitCount(this.possibleMoves()) === 1) {
      // console.log("only 1 available move");
      forcedMove = this.possibleMoves();
    } else if (this.bitCount(this.opponentWinningMoves()) === 1) {
      // console.log("must block opponent");
      forcedMove = this.opponentWinningMoves();
    }
    if (forcedMove > 0n) {
      this.playMove(forcedMove);
      let score: number = -this.getEvaluation();
      this.undoMove(forcedMove);
      return score;
    }
    //otherwise calculate a score
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
    // console.log({ vert: this.bitCount(verticalMask) });

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
      // console.log(
      //   `${
      //     shift === BigInt(GameBoard.height)
      //       ? "Diagonal \\"
      //       : shift === BigInt(GameBoard.height + 1)
      //       ? "Horizontal"
      //       : "Diagonal /"
      //   }`
      // );
      // XX..
      let fourMatch =
        (position << shift) &
        (position << (2n * shift)) &
        (blankSpace & (blankSpace >> shift));
      twoCount += this.bitCount(fourMatch);
      // console.log({ matchRight: this.bitCount(fourMatch) });
      //..XX
      fourMatch =
        (position >> shift) &
        (position >> (2n * shift)) &
        (blankSpace & (blankSpace << shift));
      twoCount += this.bitCount(fourMatch);
      // console.log({ matchLeft: this.bitCount(fourMatch) });
      // .X.X. (test L/R ends individually)
      let XOXmask = (position << shift) & (position >> shift) & blankSpace;
      fourMatch = XOXmask & (blankSpace << (2n * shift));
      twoCount += this.bitCount(fourMatch);
      // console.log({ matchOXOX: this.bitCount(fourMatch) });
      fourMatch = XOXmask & (blankSpace >> (2n * shift));
      twoCount += this.bitCount(fourMatch);
      // console.log({ matchXOXO: this.bitCount(fourMatch) });
      //X..X
      fourMatch =
        position &
        (position << (3n * shift)) &
        ((blankSpace << shift) & (blankSpace << (2n * shift)));
      twoCount += this.bitCount(fourMatch);
      // console.log({ matchXOOX: this.bitCount(fourMatch) });
      //.XX.
      fourMatch =
        (position << shift) &
        (position << (2n * shift)) &
        (blankSpace & (blankSpace << (3n * shift)));
      twoCount += this.bitCount(fourMatch);
      // console.log({ matchOXXO: this.bitCount(fourMatch) });
    }
    let threeCount = this.bitCount(
      this.getWinningPositions(position, this.mask)
    );
    // console.log({ threeCount });

    return threeCount ** 2 + twoCount;
  }
}

export { GameBoard };
