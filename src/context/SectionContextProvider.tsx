'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import useLocalStorage from '@/hook/useLocalStorage';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    highlightContexts: boolean;
    setHighlightContexts: Dispatch<SetStateAction<boolean>>;
}

export interface SectionContextType extends SectionContextData {
    
}

type SectionContextProviderProps = {
    children : ReactNode;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = () => useContext(SectionContext);

export const SectionContextProvider = ({children} : SectionContextProviderProps) => {

    const [highlightContexts, setHighlightContexts] = useState<boolean>(false);
   
    const contextValue: SectionContextType = {
        highlightContexts,
        setHighlightContexts,
    };

    return (
        <SectionContext.Provider value={contextValue}>
            {children}
        </SectionContext.Provider>
    )
}