import { use, useState } from "react";
import "./App.css";
import { Canvas } from "./components/Canvas";
import { GameBoard } from "./utils/gameBoard";
import { moveFinder } from "./utils/moveFinder";
import type { LocationData } from "./types/gameBoard.types";
import { PlayColumnButtons } from "./components/PlayColumnButtons";
import { useGameController } from "./hooks/useGameController";

function App() {
  const { makeMove, getLocationData } = useGameController();
  console.log(makeMove);
  console.log("refresh");
  const [locationData, setLocationData] = useState<Set<LocationData>>();
  // const playMove = (col: number) => {
  //   console.log(col);
  //   gameBoard.playColumn(col);
  //   let moveOptions = moveFinder(gameBoard, 4);
  //   let moveChoice = 0;
  //   let moveScore = -Infinity;
  //   moveOptions.forEach((v, i) => {
  //     // console.log(`col ${i} scores ${v}`);
  //     if (v !== null && v >= moveScore) {
  //       moveChoice = i;
  //       moveScore = v;
  //     }
  //   });
  //   console.log(`/n computer plays ${moveChoice}`);
  //   gameBoard.playColumn(moveChoice);
  //   gameBoard.printPosition();
  //   console.log("/nplayer's turn");
  // };
  return (
    <>
      <PlayColumnButtons handleClick={makeMove} />

      <Canvas locationData={locationData} />
      <button
        onClick={() => {
          let locationData = getLocationData();
          setLocationData(locationData);
        }}
      >
        Show Me
      </button>
    </>
  );
}

export default App;

/*
 import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

 const [count, setCount] = useState(0)
<div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      */
