import { useEffect, useRef, useState } from "react";
import type { LocationData } from "../types/gameBoard.types";
interface CanvasProps {
  locationData: Set<LocationData> | undefined;
}
let RADIUS = 20;

let GAMEBOARD_WIDTH = 7;
let GAMEBOARD_HEIGHT = 7;

const drawStones = (
  locationData: Set<LocationData>,
  context: CanvasRenderingContext2D
) => {
  locationData.forEach((stone) => {
    context.fillStyle = stone.colour;
    context.beginPath();
    context.arc(
      (3 * stone.col + 1.5) * RADIUS,
      (3 * (6 - stone.row) + 1.5) * RADIUS,
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

const Canvas = ({ locationData }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  console.log("CanvasRefresh");
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        drawBoard(ctx);
        if (locationData) {
          drawStones(locationData, ctx);
        }
      }
    }
  });

  useEffect(() => {
    if (context && locationData) {
      drawStones(locationData, context);
    }
  }, [locationData]);

  return (
    <canvas
      ref={canvasRef}
      width={7 * 3 * RADIUS}
      height={7 * 3 * RADIUS}
      style={{ background: "green" }}
    />
  );
};

export { Canvas };
