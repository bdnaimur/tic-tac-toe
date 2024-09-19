// Board.js
import React, { useEffect, useState } from "react";

const Board = ({ squares, winner, isNext, onClick, styleType, setStyleType }) => {
  console.log("winner", winner);
  const lines = {
    parallelLine: [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
    ],
    straightLine: [
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
    ],
    digonalLine1: [[0, 4, 8]],
    digonalLine2: [[2, 4, 6]],
  };

const findWinningLine = (winningArray) => {
  for (const [lineType, lineArray] of Object.entries(lines)) {
    for (const line of lineArray) {
      if (line?.every((value) => winningArray?.includes(value))) {
        setStyleType(lineType);
      }
    }    
  }
  return null; 
};
useEffect(()=>{

  findWinningLine(winner?.indises);
},[winner?.indises])

// if (result) {
//   console.log(`Player won on ${result.lineType} with line ${result.line}`);
// } else {
//   console.log("No winning line found.");
// }

console.log("styleType", styleType);


  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: 10,
      }}
    >
      {squares.map((square, i) => (
        <button
          className={`btn-style ${
            winner?.indises?.includes(i) && "winner-style"
          }`}
          disabled={winner?.winner || !isNext}
          key={i}
          onClick={() => onClick(i)}
        >
          {square}
          {winner?.indises?.includes(i) && (
            <div className={`${styleType}`}></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Board;
