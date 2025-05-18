import React from "react";
import LetterTile from "./LetterTile";

/* tipos ------------------------------------------------------- */
type TileStatus = "empty" | "filled" | "correct" | "present" | "absent";

interface WordRowProps {
  guess: string;          // palavra já submetida (caso a linha esteja fechada)
  current: string;        // texto que o usuário está digitando (linha activa)
  secretWord1: string;
  secretWord2: string;
  isSubmitted: boolean;
  className?: string;
}

/* componente -------------------------------------------------- */
const WordRow: React.FC<WordRowProps> = ({
  guess,
  current,
  secretWord1,
  secretWord2,
  isSubmitted,
  className = "",
}) => {
  /* avaliação estilo-Wordle — só roda se a linha foi submetida */
  const score = (attempt: string, target: string): TileStatus[] => {
    const base = Array<TileStatus>(5).fill("empty");

    if (!isSubmitted) {
      // linha em edição → filled / empty
      return base.map((_, i) => (attempt[i] ? "filled" : "empty"));
    }

    type Tmp = TileStatus | "pending";
    const res: Tmp[] = Array(5).fill("empty");
    const bal: Record<string, number> = {};

    // 1ª passada – acertos exatos
    for (let i = 0; i < 5; i++) {
      const g = attempt[i];
      const t = target[i];
      if (!g) continue;
      if (g === t) res[i] = "correct";
      else {
        res[i] = "pending";
        bal[t] = (bal[t] || 0) + 1;
      }
    }
    // 2ª passada – presentes / ausentes
    for (let i = 0; i < 5; i++) {
      if (res[i] !== "pending") continue;
      const g = attempt[i];
      if (bal[g]) {
        res[i] = "present";
        bal[g]--;
      } else res[i] = "absent";
    }
    return res as TileStatus[];
  };

  const line       = isSubmitted ? guess : current;
  const statuses1  = score(line, secretWord1);
  const statuses2  = score(line, secretWord2);
  const activePos  = current.length;            // cursor visual

  return (
    <div className={`flex justify-center gap-20 ${className}`}>
      {/* palavra 1 ------------------------------------------------ */}
      <div className="flex gap-1 sm:gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <LetterTile
            key={`w1-${i}`}
            letter={line[i] ?? ""}
            status={statuses1[i]}
            position={i}
            isActive={!isSubmitted && activePos === i}
          />
        ))}
      </div>

      {/* palavra 2 ------------------------------------------------ */}
      <div className="flex gap-1 sm:gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <LetterTile
            key={`w2-${i}`}
            letter={line[i] ?? ""}
            status={statuses2[i]}
            position={i}
            isActive={!isSubmitted && activePos === i}
          />
        ))}
      </div>
    </div>
  );
};

export default WordRow;
