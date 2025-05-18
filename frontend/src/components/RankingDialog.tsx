// frontend/src/components/RankingDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Trophy } from 'lucide-react';

interface RankingPlayer {
  name: string;
  score: number;
  attempts: number;
}

interface RankingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  players: RankingPlayer[];
  onResetRanking: () => void;
}

const RankingDialog: React.FC<RankingDialogProps> = ({ 
  isOpen, 
  onClose, 
  players,
  onResetRanking
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border border-white/10 rounded-2xl p-6">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Ranking
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4">
          {players.length > 0 ? (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 font-bold border-b border-white/10 pb-2">
                <div>Nome</div>
                <div className="text-center">Acertos</div>
                <div className="text-center">Tentativas</div>
              </div>

              {players.map((player, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className="truncate">{player.name}</div>
                  <div className="text-center">{player.score}</div>
                  <div className="text-center">{player.attempts}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-white/70">Nenhum jogador registrado ainda.</p>
          )}
        </div>

        <Button 
          onClick={onResetRanking}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white transition"
          variant="destructive"
        >
          Resetar Ranking
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RankingDialog;
