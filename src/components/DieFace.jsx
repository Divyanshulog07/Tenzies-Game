import React from "react";

const DieFace = ({ value }) => {
  const getDots = () => {
    const dotClass = "w-2 h-2 bg-black rounded-full absolute";
    const positions = {
      1: ["top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"],
      2: ["top-1 left-1", "bottom-1 right-1"],
      3: [
        "top-1 left-1",
        "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "bottom-1 right-1",
      ],
      4: [
        "top-1 left-1",
        "top-1 right-1",
        "bottom-1 left-1",
        "bottom-1 right-1",
      ],
      5: [
        "top-1 left-1",
        "top-1 right-1",
        "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "bottom-1 left-1",
        "bottom-1 right-1",
      ],
      6: [
        "top-1 left-1",
        "top-1 right-1",
        "top-1/2 left-1 transform -translate-y-1/2",
        "top-1/2 right-1 transform -translate-y-1/2",
        "bottom-1 left-1",
        "bottom-1 right-1",
      ],
    };

    return positions[value].map((pos, index) => (
      <div key={index} className={`${dotClass} ${pos}`} />
    ));
  };

  return <div className="relative w-full h-full">{getDots()}</div>;
};

export default DieFace;
