'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { LinkLayout } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    highlightContexts: boolean;
    setHighlightContexts: Dispatch<SetStateAction<boolean>>;

    collapseContexts: boolean;
    setCollapseContexts: Dispatch<SetStateAction<boolean>>;

    openCreatorDialog: boolean;
    setOpenCreatorDialog: Dispatch<SetStateAction<boolean>>;

    openLinkCreateDrawer: boolean;
    setOpenLinkCreateDrawer: Dispatch<SetStateAction<boolean>>;

    currentSection: SectionScheme;
    setCurrentSection: Dispatch<SetStateAction<SectionScheme>>;

    sectionToTransfer: SectionScheme;
    setSectionToTransfer: Dispatch<SetStateAction<SectionScheme>>;

    openSectionTransferer: boolean;
    setOpenSectionTransferer: Dispatch<SetStateAction<boolean>>;
}

interface SectionContextVoids {
    openTransferDialog : (id : string) => void;
}

const defaultSectionData : SectionScheme = {
    id : "",
    title : "",
    totalLinksCount : 0,
    links : [],
    links_layout : { layout : "Grid Detailed", size : 1 },
    selfLayout : "Grid",
    section_ref : "",
    created_at : "",
    _deleted : false
}

export interface SectionContextType extends SectionContextData, SectionContextVoids {};

type SectionContextProviderProps = { children : ReactNode };

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = () => useContext(SectionContext)!;

export const SectionContextProvider = ({children} : SectionContextProviderProps) => {

    const [currentSection, setCurrentSection] = useState<SectionScheme>(defaultSectionData);
    const [openCreatorDialog, setOpenCreatorDialog] = useState<boolean>(false);
    const [collapseContexts, setCollapseContexts] = useState<boolean>(false);
    const [highlightContexts, setHighlightContexts] = useState<boolean>(false);

    const [openLinkCreateDrawer, setOpenLinkCreateDrawer] = useState<boolean>(false);
    const [openSectionTransferer, setOpenSectionTransferer] = useState<boolean>(false);
    const [sectionToTransfer, setSectionToTransfer] = useState<SectionScheme>(defaultSectionData);

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

        currentSection,
        setCurrentSection,
        openLinkCreateDrawer,
        setOpenLinkCreateDrawer,
        sectionToTransfer,
        setSectionToTransfer,
        openSectionTransferer,
        setOpenSectionTransferer,

        openTransferDialog
    };

    return (
        <SectionContext.Provider value={contextValue}>
            {children}
        </SectionContext.Provider>
    )
}