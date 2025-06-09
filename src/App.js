import React, { useEffect, useState } from "react";
import "./App.css";

const GRID_SIZE = 15;

const CrosswordPuzzle4 = () => {
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("")));
  const [clues, setClues] = useState({ across: [], down: [] });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    fetchClues();
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, []);

  const fetchClues = async () => {
    try {
      const response = await fetch("http://localhost:10000/api/generate-clues");
      const data = await response.json();
      setClues(data);
    } catch (error) {
      console.error("Error fetching clues:", error);
    }
  };

  const handleInputChange = (row, col, value) => {
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);
  };

  const checkAnswers = () => {
    let correct = 0;
    for (let clue of [...clues.across, ...clues.down]) {
      const { row, col, direction, answer } = clue;
      for (let i = 0; i < answer.length; i++) {
        const cell = direction === "across" ? grid[row][col + i] : grid[row + i][col];
        if (cell === answer[i].toUpperCase()) correct++;
      }
    }
    setScore(correct);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="app">
      <h1>Crossword Puzzle 4</h1>
      <div className="meta">
        <span>Score: {score}</span>
        <span>Time: {formatTime(timer)}</span>
      </div>

      <div className="grid">
        {grid.map((row, rIdx) => (
          <div key={rIdx} className="row">
            {row.map((cell, cIdx) => (
              <input
                key={`${rIdx}-${cIdx}`}
                value={cell}
                maxLength={1}
                onChange={(e) => handleInputChange(rIdx, cIdx, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="clues">
        <div>
          <h3>Across</h3>
          <ol>
            {clues.across.map((clue, idx) => (
              <li key={idx}>{clue.clue}</li>
            ))}
          </ol>
        </div>
        <div>
          <h3>Down</h3>
          <ol>
            {clues.down.map((clue, idx) => (
              <li key={idx}>{clue.clue}</li>
            ))}
          </ol>
        </div>
      </div>

      <button onClick={checkAnswers}>Check Answers</button>
    </div>
  );
};

export default CrosswordPuzzle4;
