import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = 'dark' | 'light';

export default function useTheme() 
{
    const [themeLocalStorage, setThemeLocalStorage] = useLocalStorage<Theme>('theme');
    const [currentTheme, setCurrentTheme] = useState<Theme>(themeLocalStorage ?? "dark");

    const resetClasslist = () => document.body.classList.value = '';
    const addClasslist = (value : Theme) => document.body.classList.add(value);

    useEffect(() => {
        resetClasslist();
        addClasslist(currentTheme);
        setCurrentTheme(currentTheme);
        setThemeLocalStorage(currentTheme);
    }, [currentTheme, themeLocalStorage])
    
    return [currentTheme, setCurrentTheme] as const;
}

