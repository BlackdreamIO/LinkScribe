'use client'

import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { SectionScheme } from '@/scheme/Section';
import { getSections } from '@/app/actions/sectionAPI';
import useLocalStorage from '@/hook/useLocalStorage';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    contextSections: SectionScheme[];
    setContextSections: Dispatch<SetStateAction<SectionScheme[]>>;

    enableFilterContextSections : boolean;
    setEnableFilterContextSections: Dispatch<SetStateAction<boolean>>;
}

export interface SectionContextType extends SectionContextData {
    CreateSection: (section: SectionScheme) => Promise<void>;
    GetSections: (revalidateFetch? : boolean) => Promise<SectionScheme[]>;
    UpdateSection : ({currentSection, updatedSection} : { currentSection : SectionScheme, updatedSection : SectionScheme }) => Promise<void>;
    DeleteSections: (id: string) => Promise<any>;
    SaveContextSections : () => void;
    RestoreContextSections : () => void;
}

type SectionContextProviderProps = {
    children : ReactNode;
}

const SectionController = createContext<SectionContextType | undefined>(undefined);

export const useSectionController = () => useContext(SectionController);

export const SectionControllerProvider = ({children} : SectionContextProviderProps) => {

    const [contextSections, setContextSections] = useState<SectionScheme[]>([]);
    const [originalContextSections, setOriginalContextSections] = useState<SectionScheme[]>([]);

    const [localStorageSections, setLocalStorageSections] = useLocalStorage<SectionScheme[]>('sectionsCache', []);
    const [serverOperationInterrupted, setServerOperationInterrupted] = useLocalStorage<boolean>('operationInterrupted', false);

    {/* the filteredContextSections data will come from the component that does the filtering */}
    const [enableFilterContextSections, setEnableFilterContextSections] = useState<boolean>(false);

    const { isSignedIn, isLoaded, user } = useUser();

    const CreateSection = async (newSection : SectionScheme) => {
        setServerOperationInterrupted(true);
        setContextSections(prev => [...prev, newSection]);
    };

    const GetSections = async (revalidateFetch? : boolean) => {
        if(localStorageSections && localStorageSections.length > 0 && !revalidateFetch) return localStorageSections;

        if(isSignedIn && isLoaded && user.primaryEmailAddress) 
        {
            const currentUserEmail = user.primaryEmailAddress.id;
            const sections = await getSections(currentUserEmail);
            if(sections) 
            {
                setContextSections(sections);
                setLocalStorageSections(sections);
                return sections;
            }
            return [];
        }
        return [];
    };

    const UpdateSection = async ({currentSection, updatedSection} : { currentSection : SectionScheme, updatedSection : SectionScheme }) => {
        
    };
    
    const DeleteSections = async (id:string) => {
       
    }

    const SaveContextSections = () => {
        setOriginalContextSections(contextSections);
    }
    const RestoreContextSections = () => {
        setContextSections(originalContextSections);
    }

    const handleServerOperationInterrupted = async () => {
        
    }

    useEffect(() => {
        if(localStorageSections.length < 1) {
            GetSections(true);
            return;
        }
        if(serverOperationInterrupted) {
            handleServerOperationInterrupted();
        }
        setContextSections(localStorageSections);
        setOriginalContextSections(localStorageSections);
    }, [isSignedIn, isLoaded]);

    useEffect(() => {
        setLocalStorageSections(contextSections);
    }, [contextSections]);
    
    
    const contextValue: SectionContextType = {
        CreateSection,
        GetSections,
        UpdateSection,
        DeleteSections,
        SaveContextSections,
        RestoreContextSections,

        contextSections,
        setContextSections,
        enableFilterContextSections,
        setEnableFilterContextSections
    };

    return (
        <SectionController.Provider value={contextValue}>
            {children}
        </SectionController.Provider>
    )
}