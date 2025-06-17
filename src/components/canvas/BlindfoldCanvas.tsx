import {
  GAMEBOARD_HEIGHT,
  GAMEBOARD_WIDTH,
  MOBILE_DISC_RADIUS,
} from "../../constants.ts";
import { useEffect, useRef, useState } from "react";
import { drawBoard, drawDiscs } from "./utils.ts";

import type { LocationData } from "../../types.ts";
interface CanvasProps {
  locationData: LocationData | undefined;
}

const RADIUS = MOBILE_DISC_RADIUS;
const CANVAS_WIDTH = GAMEBOARD_WIDTH;
const CANVAS_HEIGHT = GAMEBOARD_HEIGHT + 1;

const BlindfoldCanvas = ({ locationData }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        drawBoard(ctx, CANVAS_WIDTH, CANVAS_HEIGHT, RADIUS);
        if (locationData) {
          drawDiscs(locationData, ctx, RADIUS);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (context && locationData) {
      drawDiscs(locationData, context, RADIUS);
    }
  }, [locationData]);

  return (
    <canvas ref={canvasRef} width={7 * 3 * RADIUS} height={7 * 3 * RADIUS} />
  );
};

export { BlindfoldCanvas };
