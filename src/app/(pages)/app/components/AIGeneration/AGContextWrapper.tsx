'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { LinkScheme } from '@/scheme/Link';

interface AGLink extends LinkScheme {
    selected : boolean;
}

export interface IAGContext {
    prompt : string;
    setPrompt: Dispatch<SetStateAction<string>>;

    selectedSectionID : string;
    setSelectedSectionID: Dispatch<SetStateAction<string>>;

    loading : boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;

    generatedLinks : LinkScheme[];
    setGeneratedLinks: Dispatch<SetStateAction<LinkScheme[]>>;

    selectedLinks : AGLink[];
    setSelectedLinks: Dispatch<SetStateAction<AGLink[]>>;

    selectAllLinks : () => void;
};

type SettingContextProviderProps = {
    children : ReactNode;
}

const AGContext = createContext<IAGContext | undefined>(undefined);

export const useAGContextWrapper = () => useContext(AGContext)!;

export const AGContextWrapper = ({children} : SettingContextProviderProps) => {

    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedSectionID, setSelectedSectionID] = useState<string>("");
    const [generatedLinks, setGeneratedLinks] = useState<LinkScheme[]>([]);
    const [selectedLinks, setSelectedLinks] = useState<AGLink[]>([]);

    const contextValue: IAGContext = {
        prompt,
        setPrompt,
        selectedSectionID,
        setSelectedSectionID,
        generatedLinks,
        setGeneratedLinks,
        selectedLinks,
        setSelectedLinks,
        loading,
        setLoading,
        selectAllLinks : () => {
            setSelectedLinks(generatedLinks.map((link) => ({...link, selected : true})));
        }
    };

    return (
        <AGContext.Provider value={contextValue}>
            {children}
        </AGContext.Provider>
    )
}