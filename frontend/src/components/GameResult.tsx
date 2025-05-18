// frontend/src/components/GameResult.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface GameResultProps {
  isOpen: boolean;
  isWin: boolean;
  score: number;
  attempts: number;
  secretWord1: string;
  secretWord2: string;
  onRestart: () => void;
  onClose: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  isOpen,
  isWin,
  score,
  attempts,
  secretWord1,
  secretWord2,
  onRestart,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border border-white/10 max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {isWin ? 'Parabéns!' : 'Fim de Jogo'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-6">
          {isWin ? (
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center animate-pulse">
              <X className="w-10 h-10 text-white" />
            </div>
          )}

          <div className="text-center text-white/80 space-y-2">
            <p>
              Você acertou <strong className="text-white">{score}</strong> de 2 palavras em <strong className="text-white">{attempts}</strong> tentativas.
            </p>
            <p>
              As palavras eram: <strong className="text-white">{secretWord1}</strong> e <strong className="text-white">{secretWord2}</strong>
            </p>
          </div>

          <Button 
            onClick={onRestart} 
            className="w-full bg-green-600 hover:bg-green-700 text-white transition"
          >
            Jogar Novamente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameResult;
