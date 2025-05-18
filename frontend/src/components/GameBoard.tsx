import React from "react";
import WordRow from "./WordRow";

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  secretWord1: string;
  secretWord2: string;
  maxAttempts: number;
  currentAttempt: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  currentGuess,
  secretWord1,
  secretWord2,
  maxAttempts,
  currentAttempt,
}) => (
  <div className="flex flex-col items-center gap-3 mt-4">
    {Array.from({ length: maxAttempts }, (_, row) => (
      <WordRow
        key={row}
        /* WordRow já define gap-20 internamente; não sobrepor aqui */
        guess={guesses[row] ?? ""}
        current={row === currentAttempt ? currentGuess : ""}
        secretWord1={secretWord1}
        secretWord2={secretWord2}
        isSubmitted={row < currentAttempt}
      />
    ))}
  </div>
);

export default GameBoard;
