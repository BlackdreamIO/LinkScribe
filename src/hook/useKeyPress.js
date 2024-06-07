import { useEffect, useCallback } from "react";

export function useKeyPress(keyName, callback) 
{
    const handleKeyInput = useCallback((e) => {
        if (e.key === keyName && callback) {
            callback();
        }
    }, [keyName, callback])

    useEffect(() => {
        const eventListener = (e) => handleKeyInput(e);
        document.addEventListener('keydown', eventListener);

        return () => {
            document.removeEventListener('keydown', eventListener);
        }
    }, [keyName, handleKeyInput])
}
