import { useEffect } from 'react';

type UseKeyPressProps = {
    mode?: "Single key" | "Multi Key";
    key: string | string[];
    caseSensitive?: boolean;
    enable? : boolean;
    callback: () => void;
    preventDefault?: boolean;
    preventElementFocus? : boolean;
};

export function useKeyPress({ mode = "Single key", key, caseSensitive = false, callback, preventDefault = true, preventElementFocus = true, enable = true }: UseKeyPressProps) {
    useEffect(() => {        

        if(!enable) return;

        let keysPressed = new Set<string>();

        const handleKeyDown = (e: KeyboardEvent) => {
            //preventDefault ? e.preventDefault() : null;

            if(!enable) return;

            const keyPressed = caseSensitive ? e.key : e.key.toLowerCase();

            const activeElement = document.activeElement as HTMLElement;
            const isInputFocused = activeElement && 
                (activeElement.tagName === "INPUT" || 
                 activeElement.tagName === "TEXTAREA" || 
                 activeElement.tagName === "SELECT" || 
                 activeElement.tagName === "DIV" || 
                 activeElement.tagName === "BUTTON" || 
                 activeElement.isContentEditable);

            if (isInputFocused && preventElementFocus) {
                return;
            }

            keysPressed.add(keyPressed);

            if (mode === "Single key" && typeof key === "string") {
                const targetKey = caseSensitive ? key : key.toLowerCase();
                if (keyPressed === targetKey) {
                    if(preventDefault) {
                        e.preventDefault();
                    }
                    callback();
                }
            } else if (mode === "Multi Key" && Array.isArray(key)) {
                const targetKeys = caseSensitive ? key : key.map(k => k.toLowerCase());
                if (targetKeys.every(k => keysPressed.has(k))) {
                    if(preventDefault) {
                        e.preventDefault();
                    }
                    callback();
                    keysPressed.clear();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if(!enable) return;
            const keyReleased = caseSensitive ? e.key : e.key.toLowerCase();
            keysPressed.delete(keyReleased);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [mode, key, caseSensitive, callback, preventDefault]);
}
