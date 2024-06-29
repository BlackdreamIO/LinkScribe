import { useEffect } from 'react';

type UseKeyPressProps = {
    mode?: "Single key" | "Multi Key";
    key: string | string[];
    callback: () => void;
};

export function useKeyPress ({ mode = "Single key", key, callback }: UseKeyPressProps) {
    useEffect(() => {
        
        let keysPressed = new Set<string>();

        const handleKeyDown = (e: KeyboardEvent) => {
            keysPressed.add(e.key);

            if (mode === "Single key" && typeof key === "string")
            {
                if (e.key === key) {
                    callback();
                }
            }
            else if (mode === "Multi Key" && Array.isArray(key))
            {
                if (key.every(k => keysPressed.has(k))) {
                    callback();
                    keysPressed.clear();
                }
            }
        }

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.delete(e.key);
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [mode, key, callback]);
};
