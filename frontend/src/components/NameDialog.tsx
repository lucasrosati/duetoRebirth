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
      <DialogContent className="bg-wordle-dark text-wordle-light border border-gray-700 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Bem-vindo ao DUETO
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-center">Digite seu nome para começar:</p>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Seu nome"
              autoFocus
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-wordle-correct hover:bg-opacity-90"
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
