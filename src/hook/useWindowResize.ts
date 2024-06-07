import { useEffect } from 'react';

type useWindowResizeType = {
    thresholdWidth : number;
    onTriggerEnter : () => void;
    onTriggerOut : () => void;
}

export function useWindowResize ({ thresholdWidth, onTriggerEnter, onTriggerOut } : useWindowResizeType)
{
    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            windowWidth <= thresholdWidth ? onTriggerEnter() : onTriggerOut();
        }

        handleResize();
        
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    
    }, [thresholdWidth, onTriggerEnter, onTriggerOut]);
}
