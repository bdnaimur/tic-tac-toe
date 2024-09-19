
import React from "react";

const SnakeBoard = ({ snakeDots, food }) => {
  const createBoard = () => {
    let rows = [];
    for (let i = 0; i < 20; i++) {
      let cells = [];
      for (let j = 0; j < 20; j++) {
        let className = "";
        if (isSnakeHead([i, j])) className = "snake-head"; // Head of the snake
        else if (isSnake([i, j])) className = "snake"; // Rest of the snake
        if (isFood([i, j])) className = "food"; // Food
        cells.push(<div key={j} className={`cell ${className}`}></div>);
      }
      rows.push(<div key={i} className="row">{cells}</div>);
    }
    return rows;
  };

  const isSnake = (cell) => {
    return snakeDots.some((dot, index) => dot[0] === cell[0] && dot[1] === cell[1] && index !== snakeDots.length - 1);
  };

  const isSnakeHead = (cell) => {
    const head = snakeDots[snakeDots.length - 1];
    return head[0] === cell[0] && head[1] === cell[1];
  };

  const isFood = (cell) => {
    return food[0] === cell[0] && food[1] === cell[1];
  };

  return (
    <div className="board">
      {createBoard()}
    </div>
  );
};
export default SnakeBoard;
