'use client'

import useLocalStorage from '@/hook/useLocalStorage';
import { IAppTheme } from '@/interface/AppTheme';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';

export const dynamic = 'force-dynamic';

interface ThemeContextData {
    appBackgroundColor : string;
    setAppBackgroundColor : Dispatch<SetStateAction<string>>;

    sectionGlassmorphismEnabled : boolean;
    setSectionGlassmorphismEnabled : Dispatch<SetStateAction<boolean>>;

    linkGlassmorphismEnabled : boolean;
    setLinkGlassmorphismEnabled : Dispatch<SetStateAction<boolean>>;
}

interface ThemeContextVoids {
    CreateTheme : (theme : IAppTheme) => void;
    ConfigureTheme : (theme : IAppTheme) => void;
    ResetTheme : () => void;
};

export interface ThemeContextType extends ThemeContextData, ThemeContextVoids {};

type ThemeContextProviderProps = { 
    children : ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => useContext(ThemeContext)!;

export const ThemeContextProvider = ({children} : ThemeContextProviderProps) => {

    const [appBackgroundColor, setAppBackgroundColor] = useState<string>("#000");

    const [sectionGlassmorphismEnabled, setSectionGlassmorphismEnabled] = useState<boolean>(false);
    const [linkGlassmorphismEnabled, setLinkGlassmorphismEnabled] = useState<boolean>(false);

    const [currentTheme, setCurrentTheme] = useLocalStorage("appTheme", JSON.stringify({
        appBackgroundColor : "#000",
        sectionGlassmorphismEnabled : false,
        linkGlassmorphismEnabled : false,
        dropdownGlassmorphism : false,
        modalGlassmorphism : false,
    }));

    useEffect(() => {
        if (currentTheme && JSON.parse(currentTheme)) {
            const parsedTheme : IAppTheme = JSON.parse(currentTheme);

            if (typeof parsedTheme !== "string") {
                setAppBackgroundColor(parsedTheme?.appBackground);
                setSectionGlassmorphismEnabled(parsedTheme.sectionGlassmorphism);
                setLinkGlassmorphismEnabled(parsedTheme.linkGlassmorphism);
            }
        }
    }, []);

    useEffect(() => {
        const newTheme = JSON.stringify({
            appBackground: appBackgroundColor,
            sectionGlassmorphism: sectionGlassmorphismEnabled,
            linkGlassmorphism: linkGlassmorphismEnabled,
            dropdownGlassmorphism : false,
            modalGlassmorphism : false
        });

        if (newTheme !== currentTheme || !currentTheme) {
            setCurrentTheme(newTheme);
        }
    }, [appBackgroundColor, sectionGlassmorphismEnabled, linkGlassmorphismEnabled, currentTheme]);

    const CreateTheme = () => {};
    const ConfigureTheme = () => {};
    const ResetTheme = () => {};

    const contextValue: ThemeContextType = {
        appBackgroundColor,
        setAppBackgroundColor,

        linkGlassmorphismEnabled,
        setLinkGlassmorphismEnabled,
        sectionGlassmorphismEnabled,
        setSectionGlassmorphismEnabled,

        CreateTheme,
        ConfigureTheme,
        ResetTheme
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    )
}