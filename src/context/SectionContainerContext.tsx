'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { LinkLayout, LinkScheme } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';
import { useKeyPress } from '@/hook/useKeyPress';

export const dynamic = 'force-dynamic';

interface SectionContainerContextData {
    sectionHighlighted : boolean;
    setSectionHighlighted : Dispatch<SetStateAction<boolean>>;

    openCreatorDialog : boolean;
    setOpenCreatorDialog : Dispatch<SetStateAction<boolean>>;

    selectedSections : SectionScheme[];
    setSelectedSections : Dispatch<SetStateAction<SectionScheme[]>>;

    minimizeAllSections : boolean;
    setMinimizeAllSections : Dispatch<SetStateAction<boolean>>;
}

interface SectionContainerContextVoid {
    SelectAllSection : () => void;
    DselectAllSection : () => void;
}

export interface SectionContextType extends SectionContainerContextData, SectionContainerContextVoid {};

type SectionContextProviderProps = { children : ReactNode };

const SectionContainerContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContainerContext = () => useContext(SectionContainerContext)!;

export const SectionContainerContextProvider = ({children} : SectionContextProviderProps) => {

    const [sectionHighlighted, setSectionHighlighted] = useState(false);
    const [selectedSections, setSelectedSections] = useState<SectionScheme[]>([]);
    const [openCreatorDialog, setOpenCreatorDialog] = useState(false);
    const [minimizeAllSections, setMinimizeAllSections] = useState(false);

    useKeyPress({
        mode : "Multi Key",
        preventDefault : true,
        enable : true,
        key : ["Control", "a"],
        callback() {
            sectionHighlighted ? DselectAllSection() : SelectAllSection();
        },
    })

    useKeyPress({
        mode : "Single key",
        preventDefault : true,
        enable : true,
        key : "Escape",
        callback() {
            setSectionHighlighted(false);
            setSelectedSections([]);
        },
    })

    useEffect(() => {
        //console.log("Section Highlight : ", sectionHighlighted ? selectedSections.map((x) => x.title) : []);
    }, [sectionHighlighted, selectedSections])

    const SelectAllSection = () => {
        setSectionHighlighted(true);
    }
    const DselectAllSection = () => {
        setSectionHighlighted(false);
    }
    
    
    const contextValue: SectionContextType = {
        sectionHighlighted,
        setSectionHighlighted,
        openCreatorDialog,
        setOpenCreatorDialog,
        selectedSections,
        setSelectedSections,
        minimizeAllSections,
        setMinimizeAllSections,

        SelectAllSection,
        DselectAllSection,
    };

    return (
        <SectionContainerContext.Provider value={contextValue}>
            {children}
        </SectionContainerContext.Provider>
    )
}