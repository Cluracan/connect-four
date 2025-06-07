import readline from "readline";
import { GameBoard } from "./gameBoard";
import { moveFinder } from "./moveFinder";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getPlayerCol = (question: string) => {
  return new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const main = async () => {
  const gameBoard = new GameBoard();
  gameBoard.printPosition();
  let gameOver = false;
  let playerCol;
  while (!gameOver) {
    playerCol = await getPlayerCol("Choose a column:  ");
    let colChoice = parseInt(playerCol);
    console.log(`You chose ${colChoice}`);
    gameBoard.playColumn(colChoice);
    gameBoard.printPosition();
    let moveOptions = moveFinder(gameBoard, 4);
    let moveChoice = 0;
    let moveScore = -Infinity;
    moveOptions.forEach((v, i) => {
      console.log(`col ${i} scores ${v}`);
      if (v !== null && v >= moveScore) {
        moveChoice = i;
        moveScore = v;
      }
    });
    console.log(`/n computer plays ${moveChoice}`);
    gameBoard.playColumn(moveChoice);
    gameBoard.printPosition();
    console.log("/nplayer's turn");
  }

  console.log("done");
  rl.close();
};

main();
