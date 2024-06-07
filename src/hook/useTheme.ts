import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";

type Theme = 'dark' | 'light' | 'system';

export default function useTheme({theme='system'} : { theme : Theme }) 
{
    const [currentTheme, setCurrentTheme] = useState<Theme>(theme);
    const [themeLocalStorage, setThemeLocalStorage] = useLocalStorage<Theme>('theme');

    const resetClasslist = () => document.body.classList.value = '';
    const addClasslist = (value : Theme) => document.body.classList.add(value);

    useEffect(() => {
        if(currentTheme == 'system') {
            resetClasslist();
            addClasslist(themeLocalStorage);
        }
        else {
            resetClasslist();
            addClasslist(currentTheme);
            setCurrentTheme(currentTheme);
            setThemeLocalStorage(currentTheme);
        }
    }, [currentTheme, theme])
    
    return [currentTheme, setCurrentTheme] as const;
}

