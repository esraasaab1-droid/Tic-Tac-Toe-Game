import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button onClick={onSquareClick} className="square">
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const winner = calculateWinner(squares);

  // التحقق من التعادل
  const isDraw = !winner && squares.every((square) => square !== null);

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    // إذا الخانة مستخدمة أو في فائز، لا نسمح بالضغط
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="board">

      {/* Status */}
      <div
        className={`status ${
          winner ? "winner" : isDraw ? "draw" : ""
        }`}
      >
        {status}
      </div>

      {/* Row 1 */}
      <div className="board-row">
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
        />

        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
        />

        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
        />
      </div>

      {/* Row 2 */}
      <div className="board-row">
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
        />

        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
        />

        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
        />
      </div>

      {/* Row 3 */}
      <div className="board-row">
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
        />

        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
        />

        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
        />
      </div>

    </div>
  );
}


// =========================
// Calculate Winner
// =========================

function calculateWinner(squares) {
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