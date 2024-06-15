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

    const [_, __, getLocalStorageSectionByKey, setLocalStorageSectionByKey] = useLocalStorage<SectionScheme[]>('sectionsCache', []);
    const [serverOperationInterrupted, setServerOperationInterrupted] = useLocalStorage<boolean>('operationInterrupted', false);

    {/* the filteredContextSections data will come from the component that does the filtering */}
    const [enableFilterContextSections, setEnableFilterContextSections] = useState<boolean>(false);

    const { isSignedIn, isLoaded, user } = useUser();

    const CreateSection = async (newSection : SectionScheme) => {
        setServerOperationInterrupted(true);
        setContextSections(prev => [...prev, newSection]);
    };

    const GetSections = async (revalidateFetch? : boolean) => {
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = user.primaryEmailAddress.emailAddress.replaceAll("@", "").replaceAll(".", "");
            console.log(currentUserEmail, " : ", getLocalStorageSectionByKey(currentUserEmail) && getLocalStorageSectionByKey(currentUserEmail)?.length);

            if(getLocalStorageSectionByKey(currentUserEmail) && !revalidateFetch) return getLocalStorageSectionByKey(currentUserEmail);

            else
            {
                console.log(`REQUEST HAS BEEN MADE ${new Date().toTimeString()}`);
                const sections = await getSections(currentUserEmail);
                if(sections) 
                {
                    setContextSections(sections);
                    setLocalStorageSectionByKey(currentUserEmail, sections);
                    return sections;
                }
                return [];
            }   
        }
        else
        {
            return [];
        }
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

    useEffect(() => {
        const getSections = async () => {
            await GetSections(true);
        }
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = user.primaryEmailAddress.emailAddress.replaceAll("@", "").replaceAll(".", "");
            if(getLocalStorageSectionByKey(currentUserEmail).length < 1)
            {
                console.log("response made from useeffect");
                getSections()
                return;
            }
            else {
                const sections = GetSections();
                console.log("use effecr local storage sections : ", sections);
            }
            setContextSections(getLocalStorageSectionByKey(currentUserEmail));
            setOriginalContextSections(getLocalStorageSectionByKey(currentUserEmail));
        }
    }, [isSignedIn, isLoaded, user]);
    

    useEffect(() => {
        if(user?.primaryEmailAddress) 
        {
            const currentUserEmail = user.primaryEmailAddress.emailAddress.replaceAll("@", "").replaceAll(".", "");
            setLocalStorageSectionByKey(currentUserEmail, contextSections);
        }
    }, [contextSections, isSignedIn, isLoaded, user]);
    
    
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