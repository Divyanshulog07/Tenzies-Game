import React, { useState, useEffect } from "react";
import Die from "./Die";
import Realistic from "./Confetti";
import HighScore from "./HighScore";
import Timer from "./Timer";

const Board = () => {
  const [dice, setDice] = useState(
    () => JSON.parse(localStorage.getItem("dice")) || generate_dice()
  );
  const [rollsCount, setRollsCount] = useState(
    () => Number(localStorage.getItem("rollsCount")) || 0
  );
  const [running, setRunning] = useState(
    () => localStorage.getItem("running") || "idle"
  );
  const [time, setTime] = useState(
    () => Number(localStorage.getItem("time")) || 0
  );
  const [gameStartTime, setGameStartTime] = useState(
    () => Number(localStorage.getItem("gameStartTime")) || 0
  );
  const [gameEndTime, setGameEndTime] = useState(
    () => Number(localStorage.getItem("gameEndTime")) || 0
  );
  const [best, setBest] = useState(
    () => Number(localStorage.getItem("highscore")) || 0
  );
  const [gameButton, setGameButton] = useState(
    () => localStorage.getItem("gameButton") || "Start"
  );
  const [isHighScore, setIsHighScore] = useState(false);
  const [showHighScore, setShowHighScore] = useState(
    () => JSON.parse(localStorage.getItem("showHighScore")) || false
  );

  useEffect(() => {
    localStorage.setItem("dice", JSON.stringify(dice));
    localStorage.setItem("rollsCount", rollsCount);
    localStorage.setItem("running", running);
    localStorage.setItem("time", time);
    localStorage.setItem("gameStartTime", gameStartTime);
    localStorage.setItem("gameEndTime", gameEndTime);
    localStorage.setItem("gameButton", gameButton);
    localStorage.setItem("showHighScore", JSON.stringify(showHighScore));
  }, [
    dice,
    rollsCount,
    running,
    time,
    gameStartTime,
    gameEndTime,
    gameButton,
    showHighScore,
  ]);

  useEffect(() => {
    const first = dice[0].value;

    if (dice.every((die) => die.hold && die.value === first)) {
      setGameEndTime(Date.now());
      setRunning("win");
      setGameButton("New Game");

      if (time < best || best === 0) {
        setBest(time);
        setIsHighScore(true); // Set high score flag
        setShowHighScore(true); // Show high score modal
      } else {
        setIsHighScore(false); // Reset high score flag
      }
    }
  }, [dice, time, best]);

  useEffect(() => {
    let timer;

    if (running === "running") {
      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    localStorage.setItem("highscore", best);
  }, [best]);

  function generate_dice() {
    const list = [];

    for (let i = 0; i < 10; i++) {
      list.push({
        id: i,
        value: Math.ceil(Math.random() * 6),
        hold: false,
      });
    }

    return list;
  }

  const hold_die = (index) => {
    if (running === "running") {
      setDice((prev) =>
        prev.map((die) =>
          die.id === index ? { ...die, hold: !die.hold } : die
        )
      );
    }
  };

  const roll = () => {
    if (running === "idle") {
      startGame();
    } else if (running === "running") {
      setDice((prev) =>
        prev.map((die) =>
          die.hold ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
      setRollsCount((prev) => prev + 1);
    }
  };

  const reset = () => {
    setRunning("idle");
    setDice(generate_dice());
    setTime(0);
    setGameStartTime(0);
    setGameEndTime(0);
    setGameButton("Start");
    setRollsCount(0);
    setIsHighScore(false);
    setShowHighScore(false); // Reset high score modal visibility
  };

  const startGame = () => {
    setRunning("running");
    setGameButton("Rolls");
    setGameStartTime(Date.now());
    setRollsCount(0);
  };

  const game_over = running === "win" || running === "lose";

  return (
    <>
      <Realistic pop={isHighScore} finish={game_over && !isHighScore} />
      {showHighScore && (
        <HighScore time={best} onClose={() => setShowHighScore(false)} />
      )}
      <Timer
        current_time={time}
        best_time={best}
        running={running}
        rollsCount={rollsCount}
      />
      <div className="grid grid-cols-5 gap-4 justify-center">
        {dice.map((die) => (
          <Die
            key={die.id}
            die={die}
            hold={() => hold_die(die.id)}
            disabled={running !== "running"}
            win={game_over}
          />
        ))}
      </div>
      {game_over && (
        <div>
          Your Time: {Math.floor((gameEndTime - gameStartTime) / 1000)} seconds
        </div>
      )}
      <button
        className={`mt-4 px-4 py-2 font-semibold rounded ${
          game_over ? "bg-red-500 text-white" : "bg-blue-500 text-white"
        }`}
        onClick={game_over ? reset : roll}
      >
        {gameButton}
      </button>
      {running === "running" && (
        <button
          className="mt-4 ml-4 px-4 py-2 bg-gray-500 text-white rounded"
          onClick={reset}
        >
          Quit
        </button>
      )}
    </>
  );
};

export default Board;