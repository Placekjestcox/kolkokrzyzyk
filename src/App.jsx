import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = winner ? `Winner: ${winner}` : null;

  return (
    <div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div key={row} className="board-row">
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              return <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />;
            })}
          </div>
        ))}
      </div>
      {status && <div className="status">{status}</div>}
    </div>
  );
}

function App() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const newHistory = history.slice(0, currentMove + 1);
    setHistory([...newHistory, nextSquares]);
    setCurrentMove(newHistory.length);
    setXIsNext(!xIsNext);
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setXIsNext(move % 2 === 0);
  }

  const moves = history.slice(1).map((squares, move) => {
    const description = `Go to move #${move + 1}`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move + 1)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <div className="status-container"><br/>
            <div className="next-player">
              {currentMove === 0 ? "Go to game start" : `Next player: ${xIsNext ? "X" : "O"}`}
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
