/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import GameHeader    from "@/components/GameHeader";
import GameBoard     from "@/components/GameBoard";
import GameResult    from "@/components/GameResult";
import RankingDialog from "@/components/RankingDialog";
import NameDialog    from "@/components/NameDialog";
import { Button }    from "@/components/ui/button";
import { fetchWords } from "@/lib/api";

/* ───────────────── tipos & helpers ───────────────── */
type GameState = "menu" | "playing" | "won" | "lost";
interface RankingEntry { name: string; score: number; attempts: number }

const LS_KEY       = "dueto_rank";
const MAX_ATTEMPTS = 6;

const readRank  = (): RankingEntry[] => JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
const writeRank = (r: RankingEntry[])  => localStorage.setItem(LS_KEY, JSON.stringify(r));

/* ───────────────── componente ───────────────── */
const Index: React.FC = () => {
  const { toast } = useToast();

  /* estado principal */
  const [view,         setView]         = useState<GameState>("menu");
  const [playerName,   setPlayerName]   = useState("");
  const [secret1,      setSecret1]      = useState("");
  const [secret2,      setSecret2]      = useState("");
  const [found1,       setFound1]       = useState(false);
  const [found2,       setFound2]       = useState(false);
  const [guesses,      setGuesses]      = useState<string[]>([]);
  const [current,      setCurrent]      = useState("");
  const [attempt,      setAttempt]      = useState(0);
  const [lastScore,    setLastScore]    = useState(0);
  const [ranking,      setRanking]      = useState<RankingEntry[]>(readRank);
  const [showNameDlg,  setShowNameDlg]  = useState(false);
  const [showRanking,  setShowRanking]  = useState(false);
  const [showResult,   setShowResult]   = useState(false);

  const [secret1, setSecret1] = useState("");
  const [secret2, setSecret2] = useState("");

  const [guesses, setGuesses]   = useState<string[]>([]);
  const [current, setCurrent]   = useState("");
  const [attempt, setAttempt]   = useState(0);
  const [state,   setState]     = useState<GameState>("playing");

  const [ranking,       setRanking]       = useState<RankingEntry[]>(readRank);
  const [showRanking,   setShowRanking]   = useState(false);
  const [showResult,    setShowResult]    = useState(false);

  /* ---------- inicia / reinicia partida ---------- */
  const startGame = useCallback(async () => {
    try {
      const { palavra1, palavra2 } = await fetchWords();
      setSecret1(palavra1.toLowerCase());
      setSecret2(palavra2.toLowerCase());
    } catch {
      toast({
        title: "Erro",
        description: "Backend indisponível – usando palavras locais.",
        variant: "destructive",
      });
      const local = ["aureo", "cargo"];           // fallback
      setSecret1(local[0]);
      setSecret2(local[1]);
    }
    setGuesses([]); setCurrent(""); setAttempt(0);
    setFound1(false); setFound2(false); setLastScore(0);
    setShowResult(false); setView("playing");
  }, [toast]);

  /* ─────────── listener de teclado ─────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showName || state !== "playing") return;
      if (e.key === "Enter")   { e.preventDefault(); handleEnter();   }
      else if (e.key === "Backspace") { e.preventDefault(); handleBack(); }
      else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleLetter(e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, current, found1, found2, showNameDlg]);

  /* ---------- lógica Wordle ---------- */
  const evaluate = (guess: string, target: string): TileStatus[] => {
    type Tmp = TileStatus | "pending";
    const res: Tmp[] = Array(5).fill("empty");
    const bal: Record<string, number> = {};

  const finishRound = (score: number) => {
    setLastScore(score);
    const newRank = [...ranking, { name: playerName, score, attempts: attempt + 1 }]
      .sort((a,b)=> b.score!==a.score ? b.score-a.score : a.attempts-b.attempts)
      .slice(0,10);
    setRanking(newRank); writeRank(newRank);
    setShowResult(true);
  };

  /* ---------- handlers ---------- */
  const handleLetter = (l: string) => {
    if (current.length < 5) setCurrent((p) => p + l);
  };
  const handleBack = () => setCurrent((p) => p.slice(0, -1));

  const handleEnter = () => {
    if (current.length !== 5) {
      toast({ title: "Palavra incompleta", description: "Digite 5 letras antes de enviar.", variant: "destructive" });
      return;
    }

    const hit =
      (current === secret1 ? 1 : 0) + (current === secret2 ? 1 : 0);

    setGuesses((g) => [...g, current]);
    setCurrent("");

    if (hit === 2) {
      setState("won");
      finish(1);                          // score 1 (uma dupla acertada)
    } else if (attempt + 1 >= MAX_ATTEMPTS) {
      setState("lost");
      finish(hit);
    }
  };

  /* ─────────── telas ─────────── */
  if (view === "menu") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white gap-6">
        <h1 className="text-5xl font-extrabold tracking-widest">DUETO</h1>

        <Button className="w-40 bg-indigo-600 hover:bg-indigo-700" onClick={()=> setShowNameDlg(true)}>
          Jogar
        </Button>
        <Button variant="secondary" className="w-40" onClick={()=> setShowRanking(true)}>
          Visualizar Ranking
        </Button>

        <NameDialog
          isOpen={showNameDlg}
          onSubmit={name => { setPlayerName(name.trim()); setShowNameDlg(false); startFresh(); }}
        />
        <RankingDialog
          isOpen={showRanking}
          onClose={()=> setShowRanking(false)}
          players={ranking}
          onResetRanking={()=> { setRanking([]); writeRank([]); }}
        />
      </main>
    );
  }

  /* ─────────── tela de jogo ─────────── */
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white px-4 py-10">
      <GameHeader openRanking={()=> setShowRanking(true)} />

      <div className="my-10">
        <GameBoard
          guesses={guesses}
          currentGuess={current}
          secretWord1={secret1}
          secretWord2={secret2}
          maxAttempts={MAX_ATTEMPTS}
          currentAttempt={attempt}
        />
      </div>

      <GameResult
        isOpen={showResult}
        isWin={state === "won"}
        score={state === "won" ? 1 : 0}
        attempts={attempt}
        secretWord1={secret1}
        secretWord2={secret2}
        onRestart={()=> setView("menu")}
        onClose={()=> setShowResult(false)}
      />

      <RankingDialog
        isOpen={showRanking}
        onClose={()=> setShowRanking(false)}
        players={ranking}
        onResetRanking={()=> { setRanking([]); writeRank([]); }}
      />
    </main>
  );
};

export default Index;