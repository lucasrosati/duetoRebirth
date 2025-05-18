/* ---------------------------  Index.tsx  --------------------------- */
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

import GameHeader    from "@/components/GameHeader";
import GameBoard     from "@/components/GameBoard";
import Keyboard      from "@/components/Keyboard";
import GameResult    from "@/components/GameResult";
import RankingDialog from "@/components/RankingDialog";
import NameDialog    from "@/components/NameDialog";

import { fetchWords }     from "@/lib/api";
import { loadRank, saveRank } from "@/lib/rank";

/* ---------- tipos ---------- */
type TileStatus = "empty" | "filled" | "correct" | "present" | "absent";
type KeyStatus  = "correct" | "present" | "absent";
interface RankingEntry { name: string; score: number; attempts: number; }

const MAX_ATTEMPTS = 6;

/* ================= componente ================= */
const Index: React.FC = () => {
  const { toast }                = useToast();

  const [player, setPlayer]      = useState("");
  const [showName, setShowName]  = useState(true);

  const [secret1, setSecret1]    = useState("");
  const [secret2, setSecret2]    = useState("");

  const [guesses, setGuesses]    = useState<string[]>([]);
  const [current, setCurrent]    = useState("");
  const [attempt, setAttempt]    = useState(0);
  const [state, setState]        = useState<"playing" | "won" | "lost">("playing");

  const [score, setScore]        = useState(0);
  const [keyStatus, setKeyStatus]= useState<Record<string, KeyStatus>>({});

  const [rank, setRank]          = useState<RankingEntry[]>(loadRank());
  const [rankOpen, setRankOpen]  = useState(false);

  /* -------- inicia / reinicia -------- */
  const startGame = useCallback(async () => {
    try {
      const { palavra1, palavra2 } = await fetchWords();
      setSecret1(palavra1);
      setSecret2(palavra2);
    } catch {
      toast({
        title: "Erro",
        description: "Backend indisponível — usando fallback.",
        variant: "destructive"
      });
      setSecret1("tempo");
      setSecret2("veloz");
    }

    setGuesses([]);
    setCurrent("");
    setAttempt(0);
    setScore(0);
    setKeyStatus({});
    setState("playing");
  }, [toast]);

  useEffect(() => { if (player) startGame(); }, [player, startGame]);

  /* -------- keyboard global -------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (showName || tag === "INPUT" || tag === "TEXTAREA") return;

      const k = e.key.toLowerCase();
      if (k === "enter")         { e.preventDefault(); pressEnter(); }
      else if (k === "backspace"){ e.preventDefault(); pressBack(); }
      else if (/^[a-z]$/.test(k)){ e.preventDefault(); pressLetter(k); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* -------- avaliação Wordle -------- */
  const evaluate = (guess: string, target: string): TileStatus[] => {
    type Tmp = TileStatus | "pending";
    const res: Tmp[] = Array(5).fill("empty");
    const bal: Record<string, number> = {};

    for (let i = 0; i < 5; i++) {
      const g = guess[i], t = target[i];
      if (!g) continue;
      if (g === t) res[i] = "correct";
      else { res[i] = "pending"; bal[t] = (bal[t] || 0) + 1; }
    }
    for (let i = 0; i < 5; i++) {
      if (res[i] !== "pending") continue;
      const g = guess[i];
      if (bal[g]) { res[i] = "present"; bal[g]--; }
      else        { res[i] = "absent";  }
    }
    return res as TileStatus[];
  };

  /* -------- handlers -------- */
  const pressLetter = (l: string) => {
    if (state !== "playing" || current.length >= 5) return;
    setCurrent(p => p + l);
  };
  const pressBack = () => state === "playing" && setCurrent(p => p.slice(0, -1));

  const pressEnter = () => {
    if (state !== "playing" || current.length !== 5) return;

    const rowScore = (current === secret1 ? 1 : 0) + (current === secret2 ? 1 : 0);
    const newScore = score + rowScore;          // <-- valor correto para ranking
    setScore(newScore);

    /* teclado */
    const upd = { ...keyStatus };
    [...evaluate(current, secret1), ...evaluate(current, secret2)]
      .forEach((st, idx) => {
        const ch = current[idx % 5];
        if (!ch) return;
        if (st === "correct") upd[ch] = "correct";
        else if (st === "present" && upd[ch] !== "correct") upd[ch] = "present";
        else if (st === "absent" && !upd[ch]) upd[ch] = "absent";
      });
    setKeyStatus(upd);

    /* grid */
    setGuesses(g => [...g, current]);
    setCurrent("");
    setAttempt(a => a + 1);

    if (rowScore === 2)           { setState("won");  finish(newScore); }
    else if (attempt + 1 >= MAX_ATTEMPTS) { setState("lost"); finish(newScore); }
  };

  /* -------- ranking -------- */
  const finish = (finalScore: number) => {
    const newRank = [...rank, { name: player, score: finalScore, attempts: attempt + 1 }]
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.attempts - b.attempts
      )
      .slice(0, 10);
    setRank(newRank);
    saveRank(newRank);
  };

  /* ---------------- render ---------------- */
  return (
    <div className="min-h-screen flex flex-col items-center max-w-3xl mx-auto px-4">
      <NameDialog
        isOpen={showName}
        onSubmit={n => { setPlayer(n.trim()); setShowName(false); }}
      />

      <GameHeader openRanking={() => setRankOpen(true)} />

      <GameBoard
        guesses={guesses}
        currentGuess={current}
        secretWord1={secret1}
        secretWord2={secret2}
        maxAttempts={MAX_ATTEMPTS}
        currentAttempt={attempt}
      />

      <Keyboard
        onKeyPress={pressLetter}
        onBackspace={pressBack}
        onEnter={pressEnter}
        keyStatuses={keyStatus}
      />

      <GameResult
        isOpen={state !== "playing"}
        isWin={state === "won"}
        score={score}
        attempts={attempt}
        secretWord1={secret1}
        secretWord2={secret2}
        onRestart={startGame}
        onClose={() => setState("playing")}
      />

      <RankingDialog
        isOpen={rankOpen}
        onClose={() => setRankOpen(false)}
        players={rank}
        onResetRanking={() => { setRank([]); saveRank([]); }}
      />
    </div>
  );
};

export default Index;
