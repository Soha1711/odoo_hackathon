import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type ToastCallback = (toasts: ToastItem[]) => void;
const listeners = new Set<ToastCallback>();
let toastList: ToastItem[] = [];

const emit = () => {
  listeners.forEach((listener) => listener([...toastList]));
};

export const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastList.push({ id, message, type: 'success' });
    emit();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  error: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastList.push({ id, message, type: 'error' });
    emit();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  warning: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastList.push({ id, message, type: 'warning' });
    emit();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  info: (message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastList.push({ id, message, type: 'info' });
    emit();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  dismiss: (id: string) => {
    toastList = toastList.filter((t) => t.id !== id);
    emit();
  },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = (newList: ToastItem[]) => {
      setToasts(newList);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={cn(
              'pointer-events-auto flex items-center justify-between w-full p-4 rounded-xl border shadow-lg bg-card text-foreground',
              {
                'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20': t.type === 'success',
                'border-red-500/30 bg-red-500/5 dark:bg-red-950/20': t.type === 'error',
                'border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20': t.type === 'warning',
                'border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20': t.type === 'info',
              }
            )}
          >
            <div className="flex items-center space-x-3">
              {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
              <span className="text-sm font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
