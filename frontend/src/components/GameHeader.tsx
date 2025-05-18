// frontend/src/components/GameHeader.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, Trophy } from "lucide-react";

interface GameHeaderProps {
  openRanking: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ openRanking }) => {
  return (
    <header className="w-full px-2 py-4 flex justify-between items-center border-b border-gray-700 mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
            <Info size={20} />
          </button>
        </DialogTrigger>
        <DialogContent className="bg-wordle-dark text-wordle-light border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Como Jogar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p>Adivinhe <strong>duas palavras</strong> secretas de 5 letras em até 6 tentativas.</p>
            <p>Depois de cada tentativa, as letras ficarão coloridas para mostrar o quão perto você está das duas palavras:</p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="letter-tile letter-tile-correct">A</div>
                <p>- A letra está na palavra e na posição correta.</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="letter-tile letter-tile-present">M</div>
                <p>- A letra está na palavra, mas na posição errada.</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="letter-tile letter-tile-absent">Z</div>
                <p>- A letra não está em nenhuma das palavras.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <h1 className="text-2xl sm:text-3xl font-bold text-center">DUETO</h1>

      <button 
        onClick={openRanking} 
        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        <Trophy size={20} />
      </button>
    </header>
  );
};

export default GameHeader;
