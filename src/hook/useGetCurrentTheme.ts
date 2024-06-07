import { useEffect, useState } from 'react';

export default function useGetTheme() 
{
    const [currentTheme, setCurrentTheme] = useState('');

    useEffect(() => {
        const checkDarkMode = () => {
            const darkModeEnabled = document.body.classList.contains('dark');
            setCurrentTheme(darkModeEnabled ? 'dark' : 'light');
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.body, { attributes: true });

        return () => observer.disconnect();
    }, []);

    return currentTheme;
}
