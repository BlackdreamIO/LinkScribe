'use client'

import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { createSection, deleteSection, getSections, updateSection } from '@/app/actions/sectionAPI';
import { SectionScheme } from '@/scheme/Section';
import useLocalStorage from '@/hook/useLocalStorage';
import { ConvertEmailString } from '@/global/convertEmailString';

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from '@/components/ui/toast';

export const dynamic = 'force-dynamic';

interface SectionContextData {
    contextSections: SectionScheme[];
    setContextSections: Dispatch<SetStateAction<SectionScheme[]>>;

    enableFilterContextSections : boolean;
    setEnableFilterContextSections: Dispatch<SetStateAction<boolean>>;
}

export interface SectionContextType extends SectionContextData {
    CreateSection: ({ newSection } : { newSection: SectionScheme }) => Promise<void>;
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
    const { toast } = useToast();

    const CreateSection = async ({ newSection } : { newSection: SectionScheme }) => {
        if(isSignedIn && isLoaded && user.primaryEmailAddress) {
            
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);

            setServerOperationInterrupted(true);
            setContextSections(prev => [...prev, newSection]);

            try
            {
                const response = await createSection(currentUserEmail, JSON.stringify(newSection), window.location.origin);
                setServerOperationInterrupted(false);
                SaveContextSections();
            }
            catch (error : any)
            {
                setServerOperationInterrupted(false);
                RestoreContextSections();
                throw new Error(error);
            }
        }
    }

    const GetSections = async (revalidateFetch? : boolean) => {
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);

            if(getLocalStorageSectionByKey(currentUserEmail) && !revalidateFetch) return getLocalStorageSectionByKey(currentUserEmail);

            else
            {
                console.log(`REQUEST HAS BEEN MADE ${new Date().toTimeString()}`);
                const sections = await getSections(currentUserEmail, window.location.origin);
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
    }

    const UpdateSection = async ({currentSection, updatedSection} : { currentSection : SectionScheme, updatedSection : SectionScheme }) => {
        const currentUserEmail = ConvertEmailString(user?.primaryEmailAddress?.emailAddress || "");
        const filteredSections = contextSections.map((section) => section === currentSection ? { ...section, ...updatedSection } : section );
        setContextSections(filteredSections);

        try
        {
            if(currentSection == updatedSection) return;
            const response = await updateSection(currentUserEmail, currentSection.id, JSON.stringify(updatedSection), window.location.origin);
            SaveContextSections();
        }
        catch (error : any) {
            RestoreContextSections();
            throw new Error(error);
        }
    }
    
    const DeleteSections = async (id:string) => {
        if(isSignedIn && isLoaded && user.primaryEmailAddress) {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
            try
            {
                const totalContextsLength = contextSections.length;
                const decreamnentAmount = 1;

                if(totalContextsLength - decreamnentAmount > 0)
                {
                    setContextSections(prevSections => {
                        const updatedSections = prevSections.filter(section => section.id !== id);
                        return updatedSections;
                    })
                    
                    await deleteSection(currentUserEmail, id, window.location.origin);
                    SaveContextSections();
                }

                else {
                    toast({
                        title: "You Must Have Atleast 1 Document In Order To Maintain Storage Invalidation",
                        description: "VEIRFICATION",
                        action : <ToastAction altText="Ok">Ok</ToastAction>,
                        className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
                    });
                }
            }
            catch (error : any) {
                RestoreContextSections();
                throw new Error(error);
            }
        }
    }

    // SAVE CONTEXT SECTION WHEN SERVER SIDE OPERATION COMPLETE
    const SaveContextSections = () => {
        setOriginalContextSections(contextSections);
    }
    // RESTORE CONTEXT SECTION WHEN SERVER SIDE OPERATION FAIL
    const RestoreContextSections = () => {
        setContextSections(originalContextSections);
    }

    useEffect(() => {
        const getSections = async () => {
            await GetSections(true);
        }
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
            if(getLocalStorageSectionByKey(currentUserEmail).length < 1)
            {
                console.log("INITIAIED FROM BACKEND");
                getSections()
                return;
            }
            else {
                GetSections();
                console.log("INITIAIED FROM LOCAL STORAGE : ");
            }
            setContextSections(getLocalStorageSectionByKey(currentUserEmail));
            setOriginalContextSections(getLocalStorageSectionByKey(currentUserEmail));
        }
    }, [isSignedIn, isLoaded, user]);
    

    useEffect(() => {
        if(user?.primaryEmailAddress) 
        {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
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