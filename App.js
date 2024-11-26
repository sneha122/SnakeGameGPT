import React, { useState, useEffect } from "react";
import "./SnakeGame.css"; // Custom CSS for styling

const SnakeGame = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState([10, 10]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const boardSize = 20;

  useEffect(() => {
    const handleKeyPress = (e) => {
        console.log("Handle this");
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction]);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        moveSnake();
      }, 200);
      return () => clearInterval(interval);
    }
  }, [snake, direction, gameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];

    let newHead;
    switch (direction) {
      case "UP":
        newHead = [head[0] - 1, head[1]];
        break;
      case "DOWN":
        newHead = [head[0] + 1, head[1]];
        break;
      case "LEFT":
        newHead = [head[0], head[1] - 1];
        break;
      case "RIGHT":
        newHead = [head[0], head[1] + 1];
        break;
      default:
        return;
    }

    newSnake.push(newHead);

    // Check for collisions
    if (checkCollision(newHead)) {
      setGameOver(true);
      return;
    }

    // Check if food is eaten
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(score + 1);
      placeFood();
    } else {
      newSnake.shift(); // Remove the tail if no food is eaten
    }

    setSnake(newSnake);
  };

  const checkCollision = ([row, col]) => {
    if (row < 0 || col < 0 || row >= boardSize || col >= boardSize) {
      return true; // Hit the wall
    }

    // Hit itself
    return snake.some((segment) => segment[0] === row && segment[1] === col);
  };

  const placeFood = () => {
    const newFood = [
      Math.floor(Math.random() * boardSize),
      Math.floor(Math.random() * boardSize),
    ];
    setFood(newFood);
  };

  const restartGame = () => {
    setSnake([[5, 5]]);
    setDirection("RIGHT");
    setFood([10, 10]);
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      <div className={`board ${gameOver ? "game-over" : ""}`}>
        {Array.from({ length: boardSize }, (_, row) =>
          Array.from({ length: boardSize }, (_, col) => {
            const isSnake = snake.some(
              (segment) => segment[0] === row && segment[1] === col
            );
            const isFood = food[0] === row && food[1] === col;
            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${isSnake ? "snake" : ""} ${
                  isFood ? "food" : ""
                }`}
              ></div>
            );
          })
        )}
      </div>
      <div className="score">
        <p>Score: {score}</p>
        {gameOver && (
          <button className="restart-button" onClick={restartGame}>
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
