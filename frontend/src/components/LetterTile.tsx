// frontend/src/components/LetterTile.tsx
import React from "react";

export type TileStatus =
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
    let base =
      "w-12 h-12 sm:w-14 sm:h-14 text-2xl font-bold flex items-center justify-center border rounded select-none transition-all duration-200 ";

    if (status === "empty" && isActive)
      return base + "border-white text-white/80";
    if (status === "filled")
      return base + "border-white text-white/80";
    if (status === "correct")
      return base + "bg-green-600 text-white border-green-600";
    if (status === "present")
      return base + "bg-yellow-500 text-white border-yellow-500";
    if (status === "absent")
      return base + "bg-zinc-700 text-white/70 border-zinc-700";
    return base + "border-white text-white/80";
  };

  const style =
    status !== "empty" && status !== "filled"
      ? { animationDelay: `${position * 0.1}s` }
      : {};

  return (
    <div className={getClassName()} style={style}>
      {letter.toUpperCase()}
    </div>
  );
};

export default LetterTile;
