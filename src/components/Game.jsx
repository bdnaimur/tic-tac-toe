// import { useState } from "react";
// import Board from "./Board";

// // Game.js (modified)
// const Game = () => {
//     const [board, setBoard] = useState(Array(9).fill(null));
//     const [isXNext, setIsXNext] = useState(true);

//     const handleClick = (index) => {
//         if (board[index] || calculateWinner(board)) return;
//         const newBoard = board.slice();
//         newBoard[index] = "X";
//         setBoard(newBoard);
//         setIsXNext(false);
//         setTimeout(() => robotMove(newBoard), 2000); // Robot move with delay
//     };

//     const robotMove = (newBoard) => {
//         if (calculateWinner(newBoard)) return;
//         const availableMoves = newBoard.map((val, i) => (val === null ? i : null)).filter(val => val !== null);
//         if (availableMoves.length > 0) {
//             const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
//             newBoard[randomMove] = "O";
//             setBoard(newBoard);
//             setIsXNext(true);
//         }
//     };

//     const calculateWinner = (squares) => {
//         const lines = [
//             [0, 1, 2],
//             [3, 4, 5],
//             [6, 7, 8],
//             [0, 3, 6],
//             [1, 4, 7],
//             [2, 5, 8],
//             [0, 4, 8],
//             [2, 4, 6],
//         ];
//         for (let i = 0; i < lines.length; i++) {
//             const [a, b, c] = lines[i];
//             if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//                 return squares[a];
//             }
//         }
//         return null;
//     };

//     const winner = calculateWinner(board);
//     return (
//         <div>
//             <h2>{winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? "You" : "Computer"}`}</h2>
//             <Board squares={board} winner={winner} isNext={isXNext} onClick={isXNext ? handleClick : null} />
//             <h6 >
//                 {winner && <><button style={{padding: "15px 25px", borderRadius: "10px"}} onClick={() => {
//                     setBoard(Array(9).fill(null))
//                     setIsXNext(true)
//                 }
//             }>Reset</button></>}
//             </h6>
//         </div>
//     );
// };

// export default Game;

// Game.js
import React, { useEffect, useState } from "react";
import Board from "./Board";
import { Howl } from "howler";

// Load sounds using Howler
const buttonPress = new Howl({ src: ["/sounds/button-press.mp3"] });
const AiWonSound = new Howl({ src: ["/sounds/ai-won.mp3"] });
const gameOverSound = new Howl({ src: ["/sounds/arisha-win.mp3"] });

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState({});
  const [styleType, setStyleType] = useState("")

  // Human player clicks
  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;

    const newBoard = board.slice();
    newBoard[index] = "X";
    setBoard(newBoard);

    buttonPress.play();

    if (!calculateWinner(newBoard) && newBoard.includes(null)) {
      setIsXNext(false);
      setTimeout(() => robotMove(newBoard), 1000); // Robot move with delay
    }
  };

  // AI Robot Move using Minimax
  const robotMove = (newBoard) => {
    const bestMove = minimax(newBoard, false); // AI is minimizing
    const updatedBoard = [...newBoard];
    updatedBoard[bestMove?.index] = "O";
    setBoard(updatedBoard); // Update the board asynchronously
    // newBoard[bestMove.index] = "O";
    // setBoard(newBoard);
    setIsXNext(true);
    buttonPress.play();
  };

  // Minimax algorithm
  const minimax = (newBoard, isMaximizing) => {
    const winner = calculateWinner(newBoard)?.winner;
    if (winner === "X") return { score: -10 };
    if (winner === "O") return { score: 10 };
    if (!newBoard.includes(null)) return { score: 0 }; // Draw

    let bestMove;
    if (isMaximizing) {
      let bestScore = -Infinity;
      newBoard.forEach((square, i) => {
        if (!square) {
          newBoard[i] = "O"; // Robot
          let move = minimax(newBoard, false);
          newBoard[i] = null;
          if (move.score > bestScore) {
            bestScore = move.score;
            bestMove = { index: i, score: bestScore };
          }
        }
      });
    } else {
      let bestScore = Infinity;
      newBoard.forEach((square, i) => {
        if (!square) {
          newBoard[i] = "X"; // Human
          let move = minimax(newBoard, true);
          newBoard[i] = null;
          if (move.score < bestScore) {
            bestScore = move.score;
            bestMove = { index: i, score: bestScore };
          }
        }
      });
    }
    return bestMove;
  };

  // const winner = calculateWinner(board);

  useEffect(() => {
    //   if (calculateWinner(board)?.winner) {
    const winner = calculateWinner(board);
    if (winner?.winner) {
      setWinner(winner);
      winner?.winner === 'X' ? setTimeout(() => gameOverSound.play(), 1000) : setTimeout(() => AiWonSound.play(), 1000); // Play the sound when a winner is determined
    }
    //   }
  }, [board]);
  // console.log("winner", winner);

  const handleResetClick = () => {
    setBoard(Array(9).fill(null));
    if (winner?.winner === "X") {
      setIsXNext(false);
      robotMove(Array(9).fill(null));
      setStyleType("")
    } else {
      setIsXNext(true);
    }
    setWinner(null);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <h2>
          {winner?.winner          
            ? `Winner: ${winner?.winner === "X" ? "You" : "AI"}`
            : `Next Player: ${isXNext ? "You" : "AI"}`}
        </h2>
        <Board
          squares={board}
          winner={winner}
          isNext={isXNext}
          onClick={isXNext ? handleClick : null}
          styleType = {styleType}
          setStyleType = {setStyleType}
        />
        <h6>
          {winner?.winner && (
            <>
              <button
                style={{ padding: "15px 25px", borderRadius: "10px" }}
                onClick={handleResetClick}
              >
                Reset
              </button>
            </>
          )}

          {!board.includes(null) && (
            <>
              <button
                style={{ padding: "15px 25px", borderRadius: "10px" }}
                onClick={handleResetClick}
              >
                Reset
              </button>
            </>
          )}
        </h6>
      </div>
    </div>
  );
};
export default Game;

// Helper function to check for a winner
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // gameOverSound.play()
      return { indises: lines[i], winner: squares[a] };
    }
  }
  return null;
};
