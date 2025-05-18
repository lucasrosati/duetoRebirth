// frontend/src/components/NameDialog.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NameDialogProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

const NameDialog: React.FC<NameDialogProps> = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-zinc-900 text-white border border-white/10 max-w-sm rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Bem-vindo ao <span className="tracking-widest">DUETO</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <p className="text-center text-white/70">Digite seu nome para começar:</p>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder-white/40"
              placeholder="Seu nome"
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white transition"
            disabled={!name.trim()}
          >
            Começar Jogo
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NameDialog;
