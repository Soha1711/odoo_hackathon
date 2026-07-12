import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
}

export function Alert({ className, variant = 'info', children, ...props }: AlertProps) {
  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg border text-sm',
        {
          'bg-blue-50/50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30': variant === 'info',
          'bg-emerald-50/50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30': variant === 'success',
          'bg-amber-50/50 text-amber-800 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30': variant === 'warning',
          'bg-red-50/50 text-red-800 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30': variant === 'error',
        },
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 mr-3">
        {variant === 'info' && <Info className="h-5 w-5" />}
        {variant === 'success' && <CheckCircle className="h-5 w-5" />}
        {variant === 'warning' && <AlertCircle className="h-5 w-5" />}
        {variant === 'error' && <XCircle className="h-5 w-5" />}
      </div>
      <div>{children}</div>
    </div>
  );
}
