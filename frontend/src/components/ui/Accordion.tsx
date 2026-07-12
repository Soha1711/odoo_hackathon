import React, { useState, createContext, useContext } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

type AccordionContextType = {
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  const [activeValue, setActiveValue] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be inside Accordion');

  const isOpen = context.activeValue === value;

  return (
    <div className={cn('border border-border rounded-lg overflow-hidden transition-all bg-card', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value, isOpen });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionTrigger({
  children,
  value,
  isOpen,
  className,
}: {
  children: React.ReactNode;
  value?: string;
  isOpen?: boolean;
  className?: string;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be inside Accordion');

  const handleClick = () => {
    if (value) {
      context.setActiveValue(context.activeValue === value ? null : value);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full flex justify-between items-center px-4 py-3 font-medium text-left hover:bg-muted/50 transition-colors',
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn('h-5 w-5 text-muted-foreground transition-transform duration-200', {
          'transform rotate-180': isOpen,
        })}
      />
    </button>
  );
}

export function AccordionContent({
  children,
  isOpen,
  className,
}: {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className={cn('px-4 pb-4 pt-0 text-sm text-muted-foreground animate-accordion-down', className)}>
      {children}
    </div>
  );
}
