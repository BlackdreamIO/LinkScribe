import { useEffect, useState } from 'react';

export const useLowDiskError = () => {
    const [lowDiskError, setLowDiskError] = useState(false);

    useEffect(() => {
        const getLocalStatus = () => {
            const dexieMemoryAllocationError = localStorage.getItem('dexieMemoryAllocationError');
            if (dexieMemoryAllocationError !== null) {
                const dexieError = JSON.parse(dexieMemoryAllocationError);
                setLowDiskError(dexieError); // Sets to true if dexieError is truthy
            } else {
                setLowDiskError(false);
            }
        };

        window.addEventListener('storage', getLocalStatus);
        getLocalStatus();

        return () => window.removeEventListener('storage', getLocalStatus);
    }, []);

    return lowDiskError; // Return the state to the component
};
