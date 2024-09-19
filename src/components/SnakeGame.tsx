// Game.js
import React, { useState, useEffect } from "react";
import SnakeBoard from "./SnakeBoard";
// import Board from "./Board";
import { Howl } from "howler";

// Load sounds using Howler
const eatSound = new Howl({ src: ['/sounds/eat.mp3'] });
const gameOverSound = new Howl({ src: ['/sounds/gameover.mp3'] });

const SnakeGame = () => {
  const [snakeDots, setSnakeDots] = useState([[10, 10], [10, 9]]); // Starting position
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);

  // Handle keypress to change snake direction
  const onKeyDown = (e) => {
    switch (e.keyCode) {
      case 38:
        setDirection("UP");
        break;
      case 40:
        setDirection("DOWN");
        break;
      case 37:
        setDirection("LEFT");
        break;
      case 39:
        setDirection("RIGHT");
        break;
      default:
        break;
    }
  };

  // Move the snake
  const moveSnake = () => {
    if (gameOver) return;

    let dots = [...snakeDots];
    let head = dots[dots.length - 1];

    switch (direction) {
      case "RIGHT":
        head = [head[0], head[1] + 1];
        break;
      case "LEFT":
        head = [head[0], head[1] - 1];
        break;
      case "DOWN":
        head = [head[0] + 1, head[1]];
        break;
      case "UP":
        head = [head[0] - 1, head[1]];
        break;
      default:
        break;
    }

    dots.push(head);
    dots.shift(); // Remove the tail
    setSnakeDots(dots);
  };

  // Check for snake eating food
  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1];
    if (head[0] === food[0] && head[1] === food[1]) {
      setFood([Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)]);
      growSnake();
      eatSound.play();
    }
  };

  // Grow snake
  const growSnake = () => {
    let newSnake = [...snakeDots];
    newSnake.unshift([]);
    setSnakeDots(newSnake);
    setSpeed(speed - 10); // Increase speed when eating
  };

  // Check for game over (snake collision)
  const checkIfCollision = () => {
    let head = snakeDots[snakeDots.length - 1];
    // Check if snake hits the wall
    if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
      setGameOver(true);
    }
    // Check if snake runs into itself
    snakeDots.forEach((dot, index) => {
      if (index !== snakeDots.length - 1 && dot[0] === head[0] && dot[1] === head[1]) {
        setGameOver(true);
        gameOverSound.play(); 
      }
    });
  };

  // Game loop (move every `speed` ms)
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      moveSnake();
      checkIfEat();
      checkIfCollision();
    }, speed);

    return () => clearInterval(interval);
  }, [snakeDots, food, direction, speed, gameOver]);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div>
      <h2>{gameOver ? "Game Over" : "Snake Game"}</h2>
      <SnakeBoard snakeDots={snakeDots} food={food} />
      {gameOver && <button onClick={() => window.location.reload()}>Restart</button>}
    </div>
  );
};

export default SnakeGame;
