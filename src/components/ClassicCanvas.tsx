import { useEffect, useRef, useState } from "react";
import type { LocationData } from "../types/gameBoard.types";
interface CanvasProps {
  locationData: LocationData | undefined;

  handleClick: any;
  canClick: Boolean;
}
let RADIUS = 20;
let backgroundColour = "#242424";
let GAMEBOARD_WIDTH = 7;
let GAMEBOARD_HEIGHT = 7;

const drawStones = (
  locationData: LocationData,
  context: CanvasRenderingContext2D
) => {
  locationData.forEach((stone) => {
    context.fillStyle = stone.colour;
    context.beginPath();
    context.arc(
      (3 * stone.col + 1.5) * RADIUS,
      (3 * (6 - stone.height) + 1.5) * RADIUS,
      RADIUS,
      0,
      2 * Math.PI
    );
    context.fill();
  });
};

const drawBoard = (context: CanvasRenderingContext2D) => {
  context.fillStyle = "blue";
  context.beginPath();
  for (let row = 0; row < GAMEBOARD_WIDTH; row++) {
    if (row === 0) continue;
    for (let col = 0; col < GAMEBOARD_HEIGHT; col++) {
      context.arc(
        (3 * col + 1.5) * RADIUS,
        (3 * row + 1.5) * RADIUS,
        RADIUS,
        0,
        2 * Math.PI
      );
      context.rect(
        (col * 3 + 3) * RADIUS,
        row * 3 * RADIUS,
        -3 * RADIUS,
        3 * RADIUS
      );
    }
  }

  context.fill();
};

const dropStone = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,

  locationData: LocationData
) => {
  let animationFrameID;
  const oldLocationData = locationData.slice(0, locationData.length - 1);
  const curStone = locationData[locationData.length - 1];

  const stone: {
    x: number;
    y: number;
    vy: number;
    colour: String;
    draw: () => void;
  } = {
    x: (3 * curStone.col + 1.5) * RADIUS,
    y: 1.5 * RADIUS,
    vy: 1,
    colour: curStone.colour,
    draw() {
      context.beginPath();
      context.arc(this.x, this.y, RADIUS, 0, Math.PI * 2);
      context.closePath();
      context.fillStyle = `${this.colour}`;
      context.fill();
      drawBoard(context);
    },
  };
  function render() {
    if (stone.y <= (3 * (7 - curStone.height) + 1.5) * RADIUS) {
      //   console.log((3 * (6 - height) + 1.5) * RADIUS);
      //   console.log(stone.y);
      context.clearRect(0, 0, canvas.width, canvas.height);
      stone.draw();
      drawStones(oldLocationData, context);
      stone.y += stone.vy;
      stone.vy += 0.9;
      animationFrameID = window.requestAnimationFrame(render);
    } else {
      drawStones(locationData, context);
    }
  }
  animationFrameID = window.requestAnimationFrame(render);
};

const ClassicCanvas = ({
  locationData,
  handleClick,
  canClick,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [boundingRect, setBoundingRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  console.log("CanvasRefresh");
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      let { top, left, width, height } = canvas.getBoundingClientRect();
      setBoundingRect({ top, left, width, height });
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        drawBoard(ctx);
        if (locationData) {
          drawStones(locationData, ctx);
        }
      }
    }
  }, []);

  //   useEffect(() => {
  //     if (context && locationData) {
  //       drawStones(locationData, context);
  //     }
  //   }, [locationData]);

  useEffect(() => {
    console.log({ locationData });
    if (canvasRef.current && context) {
      const canvas = canvasRef.current;
      if (locationData) {
        console.log({ locationData });
        dropStone(
          canvas,
          context,

          locationData
        );
      } else {
        context.fillStyle = backgroundColour;
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawBoard(context);
      }
    }
  }, [locationData]);

  return (
    <canvas
      onClick={(e) => {
        if (canClick) {
          handleClick(
            Math.floor(
              (7 * (e.clientX - boundingRect.left)) / boundingRect.width
            )
          );
        }
      }}
      ref={canvasRef}
      width={7 * 3 * RADIUS}
      height={7 * 3 * RADIUS}
      style={{ background: backgroundColour }}
    />
  );
};

export { ClassicCanvas };
