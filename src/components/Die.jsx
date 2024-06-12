import React from "react";
import DieFace from "./DieFace";

const Die = ({ die, hold, win }) => {
  let style = "flex items-center justify-center w-14 h-14 m-1 border-2 cursor-pointer";

  if (win) {
    style += " bg-red-400";
  } else {
    style += die.hold ? " bg-green-300" : "";
  }

  return (
    <div className={style} onClick={win ? undefined : hold}>
      <DieFace value={die.value} />
    </div>
  );
};

export default Die;
