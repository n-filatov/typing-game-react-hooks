import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";

function Word({ children, current, onWordEnd, onGameEnd }) {
  const [position, setPosition] = useState({
    x: Math.floor(Math.random() * window.innerWidth),
    y: 0
  });
  const [val, setVal] = useState(children);
  const [firstClick, setFirstClick] = useState(null);

  const handleKeyPress = useCallback(
    e => {
      if (e.key === val[0]) {
        setVal(val.slice(1));
      }
    },
    [val]
  );

  useEffect(
    () => {
      if (val === "") {
        onWordEnd();
      }
    },
    [val]
  );

  useEffect(
    () => {
      if (current && firstClick === null) {
        setFirstClick(true);
      }
    },
    [current, firstClick]
  );

  useEffect(
    () => {
      if (firstClick) {
        setVal(val.slice(1));
      }
    },
    [firstClick]
  );

  useEffect(
    () => {
      if (current) {
        document.addEventListener("keypress", handleKeyPress);
      }
      return () => document.removeEventListener("keypress", handleKeyPress);
    },
    [current, val]
  );

  useEffect(
    () => {
      const interval = setTimeout(() => {
        setPosition({ x: position.x, y: position.y + 10 });
      }, 500);

      if (position.y >= window.innerHeight) {
        clearInterval(interval);
        onGameEnd();
      }

      return () => clearInterval(interval);
    },
    [position]
  );

  return (
    <span
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        transition: "top 1s",
        color: current ? "red" : "initial"
      }}
    >
      {val}
    </span>
  );
}

function indexOfStartsWith(words, val) {
  let i = words.length;
  while (i--) {
    if (words[i].startsWith(val)) {
      return i;
    }
  }

  return -1;
}

function deleteByIndex(arr, index) {
  return arr.slice(0, index).concat(arr.slice(index + 1));
}

function App() {
  const [state, setState] = useState({
    words: ["Duck", "Flower", "Cat"],
    currentWordIndex: null
  });
  const [isGameOver, setGameOver] = useState(false);
  const [isWon, setWon] = useState(false);

  const handleKeyPress = useCallback(
    e => {
      if (state.currentWordIndex !== null) {
        return;
      }
      const index = indexOfStartsWith(state.words, e.key);
      if (index === -1) {
        return;
      }

      setState({ ...state, currentWordIndex: index });
    },
    [state.currentWordIndex, state.words]
  );

  const handleWordEnd = () => {
    const wordsWithoutCurrent = deleteByIndex(
      state.words,
      state.currentWordIndex
    );

    if (wordsWithoutCurrent.length === 0) {
      setWon(true);
    } else {
      setState({ words: wordsWithoutCurrent, currentWordIndex: null });
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  useEffect(
    () => {
      document.addEventListener("keypress", handleKeyPress);

      return () => document.removeEventListener("keypress", handleKeyPress);
    },
    [state.currentWordIndex]
  );

  return (
    <>
      <div>
        {state.words.map((w, i) => (
          <Word
            key={w}
            current={i === state.currentWordIndex}
            onWordEnd={handleWordEnd}
            onGameEnd={handleGameOver}
          >
            {w}
          </Word>
        ))}
      </div>
      {isGameOver && <div>Game Over</div>}
      {isWon && <div>Congrats, you won Game</div>}
    </>
  );
}

export default App;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
