import { COMPUTER_COLOUR, HUMAN_COLOUR } from "../constants";

type Location = {
  height: number;
  col: number;
  colour: StoneColour;
};

type LocationData = Location[];

type StoneColour = typeof HUMAN_COLOUR | typeof COMPUTER_COLOUR;

type Player = "human" | "computer";

export type { LocationData, StoneColour, Player };
