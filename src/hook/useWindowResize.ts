import { useEffect } from 'react';

type useWindowResizeType = {
    thresholdWidth : number;
    onTriggerEnter? : () => void;
    onTriggerOut? : () => void;
    onToggle? : (value : boolean) => void;
}

export function useWindowResize ({ thresholdWidth, onTriggerEnter, onTriggerOut, onToggle } : useWindowResizeType)
{
    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            windowWidth <= thresholdWidth ? onTriggerEnter?.() : onTriggerOut?.();
            onToggle?.(windowWidth <= thresholdWidth);
        }

        handleResize();
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    
    }, [thresholdWidth, onTriggerEnter, onTriggerOut, onToggle]);
}
