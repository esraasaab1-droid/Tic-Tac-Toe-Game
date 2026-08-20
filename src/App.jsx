import { useState } from "react";
import App from "./App";

const LINES = [
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
  for (const line of LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

function Square({ value, onSquareClick, isWinning }) {
  const classNames = [
    "square",
    value === "X" ? "x" : value === "O" ? "o" : "",
    isWinning ? "winning" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      onClick={onSquareClick}
      className={classNames}
      aria-label={value ? `مربع بقيمة ${value}` : "مربع فارغ"}
    >
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });

  const result = calculateWinner(squares);
  const winner = result?.player ?? null;
  const winningLine = result?.line ?? [];
  const isDraw = !winner && squares.every((s) => s !== null);

  let status;
  if (winner) status = `فاز اللاعب ${winner}`;
  else if (isDraw) status = "تعادل";
  else status = `دور اللاعب ${xIsNext ? "X" : "O"}`;

  function handleClick(i) {
    if (squares[i] || winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);

    const nextResult = calculateWinner(nextSquares);
    if (nextResult) {
      setScores((s) => ({ ...s, [nextResult.player]: s[nextResult.player] + 1 }));
    } else if (nextSquares.every((s) => s !== null)) {
      setScores((s) => ({ ...s, Draw: s.Draw + 1 }));
    }

    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div>
      <div className="board">
        <div className="scoreboard">
          <span>X: <span className="x">{scores.X}</span></span>
          <span>تعادل: <span className="draw">{scores.Draw}</span></span>
          <span>O: <span className="o">{scores.O}</span></span>
        </div>

        <div className={`status ${winner ? "winner" : isDraw ? "draw" : ""}`}>
          {status}
        </div>

        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => {
              const i = row * 3 + col;
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  onSquareClick={() => handleClick(i)}
                  isWinning={winningLine.includes(i)}
                />
              );
            })}
          </div>
        ))}

        <button className="reset-btn" onClick={handleReset}>
          لعبة جديدة
        </button>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body {
          margin: 0; min-height: 100vh; display: flex;
          justify-content: center; align-items: center;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          font-family: Arial, sans-serif;
        }
        .board { text-align: center; }
        .scoreboard { display: flex; justify-content: center; gap: 24px; margin-bottom: 16px; color: #cbd5e1; font-size: 15px; }
        .scoreboard .x { color: #4ade80; font-weight: bold; }
        .scoreboard .o { color: #38bdf8; font-weight: bold; }
        .scoreboard .draw { color: #facc15; font-weight: bold; }
        .status { color: white; font-size: 28px; font-weight: bold; margin-bottom: 25px; min-height: 40px; }
        .status.winner { color: #22c55e; animation: winnerAnimation 0.8s ease-in-out 3 alternate; }
        .status.draw { color: #facc15; animation: drawAnimation 0.7s ease-in-out 3 alternate; }
        .board-row { display: flex; justify-content: center; }
        .square {
          width: 100px; height: 100px; margin: 5px; border: none; border-radius: 15px;
          background: #334155; color: white; font-size: 55px; font-weight: bold; cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .square.x { color: #4ade80; }
        .square.o { color: #38bdf8; }
        .square.winning { background: #92400e; }
        .square:hover { background: #475569; transform: scale(1.05); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
        .square:active { transform: scale(0.92); }
        .reset-btn {
          margin-top: 25px; padding: 10px 24px; font-size: 16px; font-weight: bold;
          color: white; background: #334155; border: none; border-radius: 10px; cursor: pointer;
          transition: background 0.2s ease;
        }
        .reset-btn:hover { background: #475569; }
        @keyframes winnerAnimation {
          from { transform: scale(1); text-shadow: 0 0 5px #22c55e; }
          to { transform: scale(1.1); text-shadow: 0 0 10px #22c55e, 0 0 25px #22c55e; }
        }
        @keyframes drawAnimation {
          from { transform: translateX(-4px); }
          to { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
