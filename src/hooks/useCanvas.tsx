import { LocationData } from "../types/gameBoard.types";

const drawBoard = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  radius: number
) => {
  context.fillStyle = "blue";
  context.beginPath();
  for (let row = 0; row < canvasHeight; row++) {
    if (row === 0) continue;
    for (let col = 0; col < canvasWidth; col++) {
      context.arc(
        (3 * col + 1.5) * radius,
        (3 * row + 1.5) * radius,
        radius,
        0,
        2 * Math.PI
      );
      context.rect(
        (col * 3 + 3) * radius,
        row * 3 * radius,
        -3 * radius,
        3 * radius
      );
    }
  }

  context.fill("evenodd");
};

const drawDiscs = (
  locationData: LocationData,
  context: CanvasRenderingContext2D,
  radius: number
) => {
  locationData.forEach((stone) => {
    context.fillStyle = stone.colour;
    context.beginPath();
    context.arc(
      (3 * stone.col + 1.5) * radius,
      (3 * (6 - stone.height) + 1.5) * radius,
      radius,
      0,
      2 * Math.PI
    );
    context.fill();
  });
};

const dropDisc = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  locationData: LocationData,
  setStoneDropping: React.Dispatch<React.SetStateAction<boolean>>,
  canvasWidth: number,
  canvasHeight: number,
  radius: number
) => {
  let animationFrameID: number;
  const oldLocationData = locationData.slice(0, locationData.length - 1);
  const curStone = locationData[locationData.length - 1];
  setStoneDropping(true);
  const stone: {
    x: number;
    y: number;
    vy: number;
    colour: String;
    draw: () => void;
  } = {
    x: (3 * curStone.col + 1.5) * radius,
    y: 1.5 * radius,
    vy: 1,
    colour: curStone.colour,
    draw() {
      context.beginPath();
      context.arc(this.x, this.y, radius, 0, Math.PI * 2);
      context.closePath();
      context.fillStyle = `${this.colour}`;
      context.fill();
      drawBoard(context, canvasWidth, canvasHeight, radius);
    },
  };
  function render() {
    if (stone.y <= (3 * (canvasHeight - curStone.height) + 1.5) * radius) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      stone.draw();
      drawDiscs(oldLocationData, context, radius);

      stone.y += stone.vy;
      stone.vy += 0.9;
      animationFrameID = window.requestAnimationFrame(render);
    } else {
      drawDiscs(locationData, context, radius);
      setStoneDropping(false);
      window.cancelAnimationFrame(animationFrameID);
    }
  }
  animationFrameID = window.requestAnimationFrame(render);
};

export { drawBoard, drawDiscs, dropDisc };
