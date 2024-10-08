'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { LinkLayout } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';
import { useSectionContainerContext } from './SectionContainerContext';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    collapseContexts: boolean;
    setCollapseContexts: Dispatch<SetStateAction<boolean>>;

    openCreatorDialog: boolean;
    setOpenCreatorDialog: Dispatch<SetStateAction<boolean>>;

    openLinkCreateDrawer: boolean;
    setOpenLinkCreateDrawer: Dispatch<SetStateAction<boolean>>;

    currentSection: SectionScheme;
    setCurrentSection: Dispatch<SetStateAction<SectionScheme>>;

    originalSection: SectionScheme;
    setOriginalSection: Dispatch<SetStateAction<SectionScheme>>;

    sectionToTransfer: SectionScheme;
    setSectionToTransfer: Dispatch<SetStateAction<SectionScheme>>;

    openSectionTransferer: boolean;
    setOpenSectionTransferer: Dispatch<SetStateAction<boolean>>;

    openLinkSearch : boolean;
    setOpenLinkSearch : Dispatch<SetStateAction<boolean>>;

    minimized : boolean;
    setMinimized : Dispatch<SetStateAction<boolean>>;
}

interface SectionContextVoids { 
    MinimizeSection: () => void;
};

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

type SectionContextProviderProps = { 
    children : ReactNode;
};

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContext = () => useContext(SectionContext)!;

export const SectionContextProvider = ({children} : SectionContextProviderProps) => {

    const [currentSection, setCurrentSection] = useState<SectionScheme>(defaultSectionData);
    const [originalSection, setOriginalSection] = useState<SectionScheme>(defaultSectionData);
    const [openCreatorDialog, setOpenCreatorDialog] = useState<boolean>(false);
    const [collapseContexts, setCollapseContexts] = useState<boolean>(false);
    const [minimized, setMinimized] = useState<boolean>(false);

    const [openLinkSearch, setOpenLinkSearch] = useState<boolean>(false);

    const [openLinkCreateDrawer, setOpenLinkCreateDrawer] = useState<boolean>(false);
    const [openSectionTransferer, setOpenSectionTransferer] = useState<boolean>(false);
    const [sectionToTransfer, setSectionToTransfer] = useState<SectionScheme>(defaultSectionData);
    const { sectionHighlighted, setSelectedSections } = useSectionContainerContext();

    useEffect(() => {    
        setSelectedSections((prev) => 
            sectionHighlighted  ? [...prev, currentSection].filter((v, i, a) => a.indexOf(v) === i) 
            : prev.filter(section => section !== currentSection)
        );
    }, [sectionHighlighted, currentSection]);

    // useEffect(() => {
    //     if(minimizeAllSection) {
    //         setMinimized(true);
    //     }
    // }, [minimizeAllSection])

    const MinimizeSection = () => {
        setMinimized(!minimized);
        console.log("minizimg")
    }
    

    const contextValue: SectionContextType = {
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
        openLinkSearch,
        setOpenLinkSearch,
        minimized,
        setMinimized,

        originalSection,
        setOriginalSection,

        MinimizeSection,
    };

    return (
        <SectionContext.Provider value={contextValue}>
            {children}
        </SectionContext.Provider>
    )
}