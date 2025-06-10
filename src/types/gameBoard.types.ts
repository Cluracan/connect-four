type Location = {
  height: number;
  col: number;
  colour: StoneColour;
};

type LocationData = Location[];

type StoneColour = "red" | "yellow";

type Player = "human" | "computer";

export type { LocationData, StoneColour, Player };
