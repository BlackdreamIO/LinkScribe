'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { AutoSyncTimeType, DefaultExportType, KeyboardShortcutStatusType, LinkLayoutType } from '@/types/SettingTypes';
import useLocalStorage from '@/hook/useLocalStorage';
import { LinkScheme } from '@/scheme/Link';

export interface IAGContext {
    prompt : string;
    setPrompt: Dispatch<SetStateAction<string>>;

    selectedSectionID : string;
    setSelectedSectionID: Dispatch<SetStateAction<string>>;

    loading : boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;

    generatedLinks : LinkScheme[];
    setGeneratedLinks: Dispatch<SetStateAction<LinkScheme[]>>;
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

    const contextValue: IAGContext = {
        prompt,
        setPrompt,
        selectedSectionID,
        setSelectedSectionID,
        generatedLinks,
        setGeneratedLinks,
        loading,
        setLoading
    };

    return (
        <AGContext.Provider value={contextValue}>
            {children}
        </AGContext.Provider>
    )
}