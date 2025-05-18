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
      <DialogContent className="bg-wordle-dark text-wordle-light border border-gray-700 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {isWin ? 'Parabéns!' : 'Fim de Jogo'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 space-y-4">
          {isWin ? (
            <div className="w-16 h-16 bg-wordle-correct rounded-full flex items-center justify-center animate-bounce-once">
              <Check className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-wordle-absent rounded-full flex items-center justify-center animate-shake">
              <X className="w-10 h-10" />
            </div>
          )}

          <div className="text-center">
          <p className="text-sm">
            Você acertou <strong>{score}</strong> de 2 palavras em {attempts} tentativas.
          </p>
            <p className="mb-4">
              As palavras eram: <strong>{secretWord1}</strong> e <strong>{secretWord2}</strong>
            </p>
          </div>

          <Button onClick={onRestart} className="w-full bg-wordle-correct hover:bg-opacity-90">
            Jogar Novamente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameResult;
