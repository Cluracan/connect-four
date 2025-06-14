import {
  GAMEBOARD_HEIGHT,
  GAMEBOARD_WIDTH,
  MOBILE_DISC_RADIUS,
} from "../constants";
import { useEffect, useRef, useState } from "react";
import { drawBoard, drawDiscs, dropDisc } from "../hooks/useCanvas";

import type { LocationData } from "../types/gameBoard.types";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
interface CanvasProps {
  locationData: LocationData | undefined;
  handleClick: any;
  canClick: Boolean;
}

const CANVAS_WIDTH = GAMEBOARD_WIDTH;
const CANVAS_HEIGHT = GAMEBOARD_HEIGHT + 1;

const ClassicCanvas = ({
  locationData,
  handleClick,
  canClick,
}: CanvasProps) => {
  console.log("ClassicCanvasRefresh");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [boundingRect, setBoundingRect] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [stoneDropping, setStoneDropping] = useState(false);
  const { radius } = useWindowDimensions();
  const RADIUS = radius;
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      let { top, left, width, height } = canvas.getBoundingClientRect();
      setBoundingRect({ top, left, width, height });
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
    if (canvasRef.current && context) {
      const canvas = canvasRef.current;
      if (locationData) {
        //new disc has been played
        dropDisc(
          canvas,
          context,
          locationData,
          setStoneDropping,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          RADIUS
        );
      } else {
        //reset => no location data
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBoard(context, CANVAS_WIDTH, CANVAS_HEIGHT, RADIUS);
      }
    }
  }, [locationData]);

  function calculateColumn(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    return Math.floor(
      (CANVAS_WIDTH * (e.clientX - boundingRect.left)) / boundingRect.width
    );
  }

  return (
    <>
      <canvas
        onClick={(e) => {
          if (canClick && !stoneDropping) {
            handleClick(calculateColumn(e));
          }
        }}
        ref={canvasRef}
        width={CANVAS_WIDTH * 3 * RADIUS}
        height={CANVAS_HEIGHT * 3 * RADIUS}
      />
    </>
  );
};

export { ClassicCanvas };
