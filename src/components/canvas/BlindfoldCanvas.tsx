import { GAMEBOARD_HEIGHT, GAMEBOARD_WIDTH } from "../../constants.ts";
import { useEffect, useRef, useState } from "react";
import { drawBoard, drawDiscs } from "./utils.ts";
import { useWindowDimensions } from "../../hooks/useWindowDimensions.tsx";
import type { LocationData } from "../../types.ts";

const CANVAS_WIDTH = GAMEBOARD_WIDTH;
const CANVAS_HEIGHT = GAMEBOARD_HEIGHT + 1;

interface CanvasProps {
  locationData: LocationData | undefined;
}

const BlindfoldCanvas = ({ locationData }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const { radius: RADIUS } = useWindowDimensions();
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
