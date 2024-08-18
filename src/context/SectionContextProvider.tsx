'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { LinkLayout } from '@/scheme/Link';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    highlightContexts: boolean;
    setHighlightContexts: Dispatch<SetStateAction<boolean>>;

    collapseContexts: boolean;
    setCollapseContexts: Dispatch<SetStateAction<boolean>>;

    openCreatorDialog: boolean;
    setOpenCreatorDialog: Dispatch<SetStateAction<boolean>>;

    linksLayout: LinkLayout;
    setLinksLayout: Dispatch<SetStateAction<LinkLayout>>;
}

interface SectionContextVoids {
    openTransferDialog : (id : string) => void;
}

export interface SectionContextType extends SectionContextData, SectionContextVoids {
    
}

type SectionContextProviderProps = {
    children : ReactNode;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = () => useContext(SectionContext)!;

export const SectionContextProvider = ({children} : SectionContextProviderProps) => {

    const [openCreatorDialog, setOpenCreatorDialog] = useState<boolean>(false);
    const [collapseContexts, setCollapseContexts] = useState<boolean>(false);
    const [highlightContexts, setHighlightContexts] = useState<boolean>(false);

    const [linksLayout, setLinksLayout] = useState<LinkLayout>({ layout : "Grid Detailed", size : 1 });

    useEffect(() => {
        //setLinksLayout(linksLayout);
    }, [linksLayout])
    
    
    const openTransferDialog = (id : string) => {
        
    }

    const contextValue: SectionContextType = {
        highlightContexts,
        setHighlightContexts,
        collapseContexts,
        setCollapseContexts,
        openCreatorDialog,
        setOpenCreatorDialog,
        linksLayout,
        setLinksLayout,

        openTransferDialog
    };

    return (
        <SectionContext.Provider value={contextValue}>
            {children}
        </SectionContext.Provider>
    )
}