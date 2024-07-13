'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import useLocalStorage from '@/hook/useLocalStorage';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    highlightContexts: boolean;
    setHighlightContexts: Dispatch<SetStateAction<boolean>>;

    collapseContexts: boolean;
    setCollapseContexts: Dispatch<SetStateAction<boolean>>;

    openCreatorDialog: boolean;
    setOpenCreatorDialog: Dispatch<SetStateAction<boolean>>;
}

export interface SectionContextType extends SectionContextData {
    
}

type SectionContextProviderProps = {
    children : ReactNode;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = () => useContext(SectionContext);

export const SectionContextProvider = ({children} : SectionContextProviderProps) => {

    const [_, __, getDataByKey, ___] = useLocalStorage("null", []);

    const [openCreatorDialog, setOpenCreatorDialog] = useState<boolean>(false);
    const [collapseContexts, setCollapseContexts] = useState<boolean>(false);
    const [highlightContexts, setHighlightContexts] = useState<boolean>(false);
   

    useEffect(() => {

        const showLinkCount = getDataByKey("showLinkCount");

    }, [])
    

    const contextValue: SectionContextType = {
        highlightContexts,
        setHighlightContexts,
        collapseContexts,
        setCollapseContexts,
        openCreatorDialog,
        setOpenCreatorDialog
    };

    return (
        <SectionContext.Provider value={contextValue}>
            {children}
        </SectionContext.Provider>
    )
}