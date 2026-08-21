import { useState } from "react";
import "./App.css";
import XOGame from './XOGame';

function App() {
  return <XOGame />;
}

export default App;
const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of winningLines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }

  return null;
}

// الكمبيوتر - Minimax
function minimax(board, isMaximizing) {
  const winner = calculateWinner(board);

  if (winner === "O") return 10;
  if (winner === "X") return -10;

  if (board.every((square) => square !== null)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";

        const score = minimax(board, false);

        board[i] = null;

        bestScore = Math.max(bestScore, score);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "X";

        const score = minimax(board, true);

        board[i] = null;

        bestScore = Math.min(bestScore, score);
      }
    }

    return bestScore;
  }
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = "O";

      const score = minimax(board, false);

      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function Square({ value, onSquareClick, winner }) {
  return (
    <button
      className={`square ${value ? "filled" : ""} ${
        winner ? "winning-square" : ""
      }`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

export default function App() {
  const [gameMode, setGameMode] = useState(null);

  const [squares, setSquares] = useState(Array(9).fill(null));

  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);

  const isDraw = !winner && squares.every((square) => square !== null);

  function handleClick(index) {
    if (squares[index] || winner || isDraw) return;

    // إذا كانت اللعبة ضد الكمبيوتر
    if (gameMode === "computer" && !xIsNext) return;

    const nextSquares = squares.slice();

    nextSquares[index] = xIsNext ? "X" : "O";

    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // دور الكمبيوتر
    if (gameMode === "computer" && xIsNext) {
      setTimeout(() => {
        const computerMove = getBestMove(nextSquares);

        if (computerMove !== null) {
          const computerSquares = nextSquares.slice();

          computerSquares[computerMove] = "O";

          setSquares(computerSquares);
          setXIsNext(true);
        }
      }, 500);
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  function chooseMode(mode) {
    setGameMode(mode);
    resetGame();
  }

  function backToMenu() {
    setGameMode(null);
    resetGame();
  }

  // القائمة الرئيسية
  if (!gameMode) {
    return (
      <div className="game-container">
        <div className="menu">
          <h1>XO</h1>

          <p className="subtitle">Choose your game mode</p>

          <div className="mode-buttons">
            <button
              className="mode-button"
              onClick={() => chooseMode("computer")}
            >
              <span>🤖</span>
              <strong>Play vs Computer</strong>
              <small>Challenge the AI</small>
            </button>

            <button
              className="mode-button"
              onClick={() => chooseMode("friend")}
            >
              <span>👥</span>
              <strong>Play vs Friend</strong>
              <small>Play with your friend</small>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game">
        <h1>XO</h1>

        <p className="mode">
          {gameMode === "computer"
            ? "You ❌ vs Computer ⭕"
            : "Player ❌ vs Player ⭕"}
        </p>

        <div className="status">
          {winner ? (
            <div className="result winner">
              🎉 {winner === "X" ? "X" : "O"} Wins!
            </div>
          ) : isDraw ? (
            <div className="result draw">🤝 It's a Draw!</div>
          ) : (
            <div className="turn">
              {xIsNext
                ? "❌ Your Turn"
                : gameMode === "computer"
                ? "🤖 Computer is thinking..."
                : "⭕ O's Turn"}
            </div>
          )}
        </div>

        <div className="board">
          {squares.map((value, index) => {
            const isWinningSquare =
              winner &&
              winningLines.some(
                (line) => line.includes(index) && line.every((i) => squares[i] === winner)
              );

            return (
              <Square
                key={index}
                value={value}
                winner={isWinningSquare}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>

        <div className="buttons">
          <button className="reset-button" onClick={resetGame}>
            🔄 Play Again
          </button>

          <button className="menu-button" onClick={backToMenu}>
            🏠 Change Mode
          </button>
        </div>
      </div>
    </div>
  );
}
