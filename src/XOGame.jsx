import { useState } from 'react';
import './XOGame.css';

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(b) {
  for (const line of winPatterns) {
    const [a, b1, c] = line;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { winner: b[a], line };
    }
  }
  return null;
}

function minimax(b, depth, isMaximizing) {
  const winInfo = checkWinner(b);
  if (winInfo) return winInfo.winner === 'O' ? 10 - depth : depth - 10;
  if (b.every((c) => c)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'X';
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = null;
      }
    }
    return best;
  }
}

function getBestMove(b) {
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'O';
      const score = minimax(b, 0, false);
      b[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

export default function XOGame() {
  const [screen, setScreen] = useState('menu'); // menu أو game
  const [mode, setMode] = useState('pc');
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [winLine, setWinLine] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [scores, setScores] = useState({ X: 0, O: 0, D: 0 });

  function startGame(selectedMode) {
    setMode(selectedMode);
    setScreen('game');
    resetRound();
  }

  function backToMenu() {
    setScreen('menu');
    setScores({ X: 0, O: 0, D: 0 });
  }

  function resetRound() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameOver(false);
    setWinLine(null);
    setStatusMsg('');
  }

  function endRound(newBoard, winner, line) {
    setGameOver(true);
    if (line) setWinLine(line);
    if (winner) {
      setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
      setStatusMsg(
        winner === 'X' ? '🎉 فاز X!' : mode === 'pc' ? '🤖 فاز الكمبيوتر!' : '🎉 فاز O!'
      );
    } else {
      setScores((s) => ({ ...s, D: s.D + 1 }));
      setStatusMsg('🤝 تعادل!');
    }
  }

  function makeMove(i, player, boardState) {
    const newBoard = [...boardState];
    newBoard[i] = player;
    setBoard(newBoard);

    const winInfo = checkWinner(newBoard);
    if (winInfo) {
      endRound(newBoard, winInfo.winner, winInfo.line);
      return;
    }
    if (newBoard.every((c) => c)) {
      endRound(newBoard, null, null);
      return;
    }

    const next = player === 'X' ? 'O' : 'X';
    setCurrentPlayer(next);

    if (mode === 'pc' && next === 'O') {
      setTimeout(() => {
        const best = getBestMove(newBoard);
        if (best !== -1) makeMove(best, 'O', newBoard);
      }, 400);
    }
  }

  function handleCellClick(i) {
    if (gameOver || board[i]) return;
    if (mode === 'pc' && currentPlayer === 'O') return;
    makeMove(i, currentPlayer, board);
  }

  return (
    <div className="xo-app">
      <h1>XO</h1>

      {screen === 'menu' && (
        <div className="mode-select">
          <p className="subtitle">اختار طريقة اللعب</p>
          <button className="mode-btn pc" onClick={() => startGame('pc')}>
            👤 ضد الكمبيوتر
          </button>
          <button className="mode-btn friend" onClick={() => startGame('friend')}>
            👥 ضد صديق
          </button>
        </div>
      )}

      {screen === 'game' && (
        <div className="game">
          <div className="score">
            <div>X <span>{scores.X}</span></div>
            <div>تعادل <span>{scores.D}</span></div>
            <div>O <span>{scores.O}</span></div>
          </div>

          <div className="status">
            {statusMsg ||
              (mode === 'pc'
                ? currentPlayer === 'X' ? 'دورك (X)' : 'دور الكمبيوتر...'
                : `دور اللاعب: ${currentPlayer}`)}
          </div>

          <div className="board">
            {board.map((val, i) => (
              <div
                key={i}
                className={
                  'cell' +
                  (val ? ' taken ' + val.toLowerCase() : '') +
                  (winLine && winLine.includes(i) ? ' win' : '')
                }
                onClick={() => handleCellClick(i)}
              >
                {val}
              </div>
            ))}
          </div>

          <div className="controls">
            <button onClick={resetRound}>🔄 جولة جديدة</button>
            <button onClick={backToMenu}>🏠 القائمة الرئيسية</button>
          </div>
        </div>
      )}
    </div>
  );
}
