import React from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  openRanking: () => void;
}

const GameHeader: React.FC<Props> = ({ openRanking }) => (
  <header
    className="
      fixed top-0 left-0 z-10 w-full
      flex items-center justify-between
      px-6 py-4
      bg-black/90 backdrop-blur-md
      border-b border-white/10
    "
  >
    <h1 className="text-3xl font-bold tracking-widest text-white select-none">DUETO</h1>

    <Button
      variant="ghost"
      size="icon"
      onClick={openRanking}
      aria-label="Ver ranking"
      className="text-white hover:bg-white/10 transition"
    >
      <Award className="h-6 w-6" strokeWidth={2.2} />
    </Button>
  </header>
);

export default GameHeader;
