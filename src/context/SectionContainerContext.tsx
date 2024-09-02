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
}

const initialLinksTargetSection : SectionScheme = {
    id : "",
    title : "",
    section_ref : "",
    links : [],
    totalLinksCount : 0,
    selfLayout : "",
    _deleted : false,
    minimized : false,
    created_at : '',
    links_layout : { layout : "Compact", size : 2 }
}

export interface SectionContextType extends SectionContainerContextData {};

type SectionContextProviderProps = { children : ReactNode };

const SectionContainerContext = createContext<SectionContextType | undefined>(undefined);

export const useSectionContainerContext = () => useContext(SectionContainerContext)!;

export const SectionContainerContextProvider = ({children} : SectionContextProviderProps) => {

    const [sectionHighlighted, setSectionHighlighted] = useState(false);
    const [selectedSections, setSelectedSections] = useState<SectionScheme[]>([]);

    const [openCreatorDialog, setOpenCreatorDialog] = useState(false);


    useKeyPress({
        mode : "Multi Key",
        preventDefault : true,
        enable : true,
        key : ["Control", "a"],
        callback() {
            setSectionHighlighted(!sectionHighlighted);
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
    
    
    const contextValue: SectionContextType = {
        sectionHighlighted,
        setSectionHighlighted,
        openCreatorDialog,
        setOpenCreatorDialog,
        selectedSections,
        setSelectedSections,
    };

    return (
        <SectionContainerContext.Provider value={contextValue}>
            {children}
        </SectionContainerContext.Provider>
    )
}