import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MAX_DISC_RADIUS, GAMEBOARD_WIDTH } from "../constants";
type Dimensions = {
  width: number;
  height: number;
  radius: number;
};

const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    radius: Math.min(
      MAX_DISC_RADIUS,
      Math.floor(window.innerWidth / (3 * GAMEBOARD_WIDTH))
    ),
  });

  const debounced = useDebouncedCallback((dimensions: Dimensions) => {
    setDimensions(dimensions);
  }, 1000);

  useEffect(() => {
    const handleResize = () => {
      debounced({
        width: window.innerWidth,
        height: window.innerHeight,
        radius: Math.min(
          MAX_DISC_RADIUS,
          Math.floor(window.innerWidth / (3 * GAMEBOARD_WIDTH))
        ),
      });
    };
    window.addEventListener("resize", () => handleResize());
    return window.removeEventListener("resize", () => handleResize());
  }, []);
  return dimensions;
};

export { useWindowDimensions };
