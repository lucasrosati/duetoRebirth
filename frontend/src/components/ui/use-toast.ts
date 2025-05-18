// frontend/src/components/ui/use-toast.ts

import { useCallback } from 'react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const useToast = () => {
  const toast = useCallback(({ title, description, variant = 'default' }: ToastProps) => {
    // Substitua esse console.log pelo seu sistema real de toasts
    console.log(`[${variant.toUpperCase()}] ${title}: ${description}`);
    // Exemplo: chamar um componente global de toast se estiver usando shadcn/ui ou radix-toast
  }, []);

  return { toast };
};
