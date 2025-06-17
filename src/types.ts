import { COMPUTER_COLOUR, HUMAN_COLOUR } from "./constants";

type Location = {
  height: number;
  col: number;
  colour: StoneColour;
};

export type LocationData = Location[] | null;

export type StoneColour = typeof HUMAN_COLOUR | typeof COMPUTER_COLOUR;

export type Player = "human" | "computer";
