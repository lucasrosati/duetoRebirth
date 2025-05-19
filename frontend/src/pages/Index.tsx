/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import GameHeader    from "@/components/GameHeader";
import GameBoard     from "@/components/GameBoard";
import GameResult    from "@/components/GameResult";
import RankingDialog from "@/components/RankingDialog";
import NameDialog    from "@/components/NameDialog";
import { fetchWords } from "@/lib/api";

/* ---------- tipos utilitários ---------- */
type TileStatus = "empty" | "filled" | "correct" | "present" | "absent";
type GameState  = "playing" | "won" | "lost";
interface RankingEntry { name: string; score: number; attempts: number }

const LS_KEY        = "dueto_rank";
const MAX_ATTEMPTS  = 6;

/* ---------- helpers ---------- */
const readRank  = (): RankingEntry[] =>
  JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
const writeRank = (r: RankingEntry[]) =>
  localStorage.setItem(LS_KEY, JSON.stringify(r));

/* ===================================================================== */
const Index: React.FC = () => {
  const { toast } = useToast();

  /* ---------- estado principal ---------- */
  const [playerName, setPlayerName] = useState("");
  const [showName,   setShowName]   = useState(true);

  const [secret1, setSecret1] = useState("");
  const [secret2, setSecret2] = useState("");

  const [guesses, setGuesses]   = useState<string[]>([]);
  const [current, setCurrent]   = useState("");
  const [attempt, setAttempt]   = useState(0);
  const [state,   setState]     = useState<GameState>("playing");

  const [ranking,     setRanking]     = useState<RankingEntry[]>(readRank);
  const [showRanking, setShowRanking] = useState(false);
  const [showResult,  setShowResult]  = useState(false);

  /* ---------- inicia / reinicia partida ---------- */
  const startGame = useCallback(async () => {
    try {
      const { palavra1, palavra2 } = await fetchWords();
      setSecret1(palavra1.toLowerCase());
      setSecret2(palavra2.toLowerCase());
    } catch {
      toast({
        title: "Erro",
        description: "Backend indisponível – usando fallback.",
        variant: "destructive",
      });
      setSecret1("lapis");
      setSecret2("cargo");
    }
    setGuesses([]);
    setCurrent("");
    setAttempt(0);
    setState("playing");
    setShowResult(false);
  }, [toast]);

  useEffect(() => { if (playerName) startGame(); }, [playerName, startGame]);

  /* ---------- escuta teclado físico ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showName || state !== "playing") return;
      if (e.key === "Enter")        { e.preventDefault(); handleEnter(); }
      else if (e.key === "Backspace"){ e.preventDefault(); handleBack();  }
      else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleLetter(e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, state, showName]);

  /* ---------- avaliação Wordle ---------- */
  const evaluate = (guess: string, target: string): TileStatus[] => {
    type Tmp = TileStatus | "pending";
    const res: Tmp[] = Array(5).fill("empty");
    const bal: Record<string, number> = {};

    for (let i = 0; i < 5; i++) {
      const g = guess[i];
      const t = target[i];
      if (!g) continue;
      if (g === t) res[i] = "correct";
      else { res[i] = "pending"; bal[t] = (bal[t] || 0) + 1; }
    }
    for (let i = 0; i < 5; i++) {
      if (res[i] !== "pending") continue;
      const g = guess[i];
      res[i] = bal[g] ? "present" : "absent";
      if (bal[g]) bal[g]--;
    }
    return res as TileStatus[];
  };

  /* ---------- helpers de jogo ---------- */
  const totalAcertos = (lista: string[]): number =>
    (lista.includes(secret1) ? 1 : 0) + (lista.includes(secret2) ? 1 : 0);

  /* ---------- handlers ---------- */
  const handleLetter = (l: string) => {
    if (current.length < 5) setCurrent((p) => p + l);
  };
  const handleBack = () => setCurrent((p) => p.slice(0, -1));

  const handleEnter = () => {
    if (current.length !== 5) {
      toast({
        title: "Palavra incompleta",
        description: "Digite 5 letras antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    const novaLista = [...guesses, current];
    const scoreAgora = totalAcertos(novaLista);

    setGuesses(novaLista);
    setCurrent("");
    setAttempt((a) => a + 1);

    if (scoreAgora === 2) {
      setState("won");
      finish(2);
    } else if (attempt + 1 >= MAX_ATTEMPTS) {
      setState("lost");
      finish(scoreAgora);
    }
  };

  /* ---------- ranking ---------- */
  const finish = (score: number) => {
    const newRank = [...ranking, { name: playerName, score, attempts: attempt + 1 }]
      .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.attempts - b.attempts))
      .slice(0, 10);

    setRanking(newRank);
    writeRank(newRank);
    setShowResult(true);
  };

  /* =================================================================== */
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-4">
      <GameHeader openRanking={() => setShowRanking(true)} />

      <GameBoard
        guesses={guesses}
        currentGuess={current}
        secretWord1={secret1}
        secretWord2={secret2}
        maxAttempts={MAX_ATTEMPTS}
        currentAttempt={attempt}
      />

      {/* diálogos ----------------------------------------------------- */}
      <NameDialog
        isOpen={showName}
        onSubmit={(name) => { setPlayerName(name.trim()); setShowName(false); }}
      />

      <GameResult
        isOpen={showResult}
        isWin={state === "won"}
        score={totalAcertos(guesses)}
        attempts={attempt}
        secretWord1={secret1}
        secretWord2={secret2}
        onRestart={startGame}
        onClose={() => setShowResult(false)}
      />

      <RankingDialog
        isOpen={showRanking}
        onClose={() => setShowRanking(false)}
        players={ranking}
        onResetRanking={() => { setRanking([]); writeRank([]); }}
      />
    </main>
  );
};

export default Index;