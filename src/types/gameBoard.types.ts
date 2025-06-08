interface LocationData {
  row: number;
  col: number;
  colour: StoneColour;
}

type StoneColour = "red" | "yellow";

type Player = "human" | "computer";

export type { LocationData, StoneColour, Player };
