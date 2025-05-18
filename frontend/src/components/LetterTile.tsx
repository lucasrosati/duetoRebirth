// frontend/src/components/LetterTile.tsx
import React from "react";

// ①  ────────────────▼───────────────
export type TileStatus =          //  ←👉  basta acrescentar “export”
  | "empty"
  | "filled"
  | "correct"
  | "present"
  | "absent";

interface LetterTileProps {
  letter: string;
  status: TileStatus;
  position: number;
  isActive?: boolean;
}

const LetterTile: React.FC<LetterTileProps> = ({
  letter,
  status,
  position,
  isActive = false,
}) => {
  const getClassName = () => {
    let className = "letter-tile";

    if (status === "empty" && isActive)       className += " letter-tile-active";
    else if (status === "filled")             className += " letter-tile-filled";
    else if (status === "correct")            className += " letter-tile-correct";
    else if (status === "present")            className += " letter-tile-present";
    else if (status === "absent")             className += " letter-tile-absent";

    return className;
  };

  const style =
    status !== "empty" && status !== "filled"
      ? { animationDelay: `${position * 0.1}s` }
      : {};

  return (
    <div className={getClassName()} style={style}>
      {letter}
    </div>
  );
};

export default LetterTile;
