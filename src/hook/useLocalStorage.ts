import { useState } from 'react';

// generic type for the value stored in local storage
type LocalStorageValue<T> = [
    T,
    (value: T) => void,
    (key: string) => T | [],
    (key: string, value: T) => void
];

export default function useLocalStorage<T>(key: string, initialValue?: T): LocalStorageValue<T> 
{
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const initial = storedValue ? JSON.parse(storedValue) : initialValue;
    const [value, setValue] = useState<T>(initial);

    const updateValue = (newValue: T) => {
        if (typeof window !== 'undefined') {
            setValue(newValue);
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    };

    const getValue = (key: string): T | [] => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : [];
        }
        return [];
    };

    const setValueByKey = (key: string, newValue: T) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    };

    return [value, updateValue, getValue, setValueByKey] as const;
}
