// KeyboardNavigationContext.tsx

import { useKeyPress } from '@/hook/useKeyPress';
import React, { createContext, useContext, useEffect, useRef } from 'react';

interface KeyboardNavigationContextType {
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | undefined>(undefined);

export const useKeyboardNavigationContext = () => {
  const context = useContext(KeyboardNavigationContext);
  if (!context) {
    throw new Error('useKeyboardNavigationContext must be used within a KeyboardNavigationProvider');
  }
  return context;
};

type KeyboardNavigationProviderProps = {
  children: React.ReactNode;
};

export const KeyboardNavigationProvider: React.FC<KeyboardNavigationProviderProps> = ({ children }) => {
  
  const tabsRef = useRef<HTMLElement[]>([]);
  const prevFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    tabsRef.current = Array.from(document.querySelectorAll('[role="tab"]')) as HTMLElement[];
    //tabsRef.current[0]?.focus(); // Focus the first tab initially
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    /*
    const currentIndex = tabsRef.current.findIndex(tab => tab === document.activeElement);

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      const nextIndex = (currentIndex + 1) % tabsRef.current.length;
      prevFocusedRef.current = tabsRef.current[currentIndex];
      tabsRef.current[nextIndex]?.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      const prevIndex = (currentIndex - 1 + tabsRef.current.length) % tabsRef.current.length;
      prevFocusedRef.current = tabsRef.current[currentIndex];
      tabsRef.current[prevIndex]?.focus();
    } 
      */
  };

  useKeyPress({
    key : "Escape",
    callback() {
      prevFocusedRef.current?.focus();
      prevFocusedRef.current = null;
    },
  })

  const contextValue: KeyboardNavigationContextType = {
    handleKeyDown,
  };

  return (
    <KeyboardNavigationContext.Provider value={contextValue}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};
