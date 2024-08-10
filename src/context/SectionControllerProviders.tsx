'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { SectionScheme } from '@/scheme/Section';
import useLocalStorage from '@/hook/useLocalStorage';

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from '@/components/ui/toast';

import { GetSections as ClientSideGetSections } from '@/database/functions/supabase/sections/getAllSections';
import { DeleteSection as ClientSideDeleteSection } from '@/database/functions/supabase/sections/deleteSection';
import { CreateSection as ClientSideCreateSection } from '@/database/functions/supabase/sections/createSections';

import { isEqual, SynchronizeToDexieDB, SynchronizeToSupabase } from '@/helpers';
import { DexieGetSections } from '@/database/functions/dexie/DexieSections';
import { RefineEmail } from '@/helpers/NormalizeEmail';

//PouchDB.plugin(PouchDBLocalStorageAdapter);

interface SectionContextData {
    contextSections: SectionScheme[];
    setContextSections: Dispatch<SetStateAction<SectionScheme[]>>;

    enableFilterContextSections : boolean;
    setEnableFilterContextSections: Dispatch<SetStateAction<boolean>>;
}

export interface SectionContextType extends SectionContextData {
    CreateSection: ({ newSection } : { newSection: SectionScheme }) => Promise<void>;
    GetSections: (revalidateFetch? : boolean) => Promise<SectionScheme[]>;
    UpdateSection: ({currentSection, updatedSection} : { currentSection : SectionScheme, updatedSection : SectionScheme }) => Promise<void>;
    DeleteSections: (id: string) => Promise<any>;

    SaveContextSections: () => void;
    RestoreContextSections: () => void;
    Sync: () => void;
}

type SectionContextProviderProps = {
    children : ReactNode;
}

const SectionController = createContext<SectionContextType | undefined>(undefined);

export const useSectionController = () => useContext(SectionController);

export const SectionControllerProvider = ({children} : SectionContextProviderProps) => {

    const [contextSections, setContextSections] = useState<SectionScheme[]>([]);
    const [originalContextSections, setOriginalContextSections] = useState<SectionScheme[]>([]);

    const [serverOperationInterrupted, setServerOperationInterrupted] = useLocalStorage<boolean>('operationInterrupted', false); // track server operation interruption

    {/* the filteredContextSections data will come from the component that does the filtering */}
    const [enableFilterContextSections, setEnableFilterContextSections] = useState<boolean>(false);
    const [isCacheLoaded, setIsCacheLoaded] = useState(false);

    const { isSignedIn, isLoaded, user } = useUser();
    const { getToken } = useAuth();
    const { toast } = useToast();

    const ToastMessage = (message : string, descirption? : string, type : "Status" | "Error" | "Warning" = "Status") => {
        let className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";
        switch (type) {
            case "Status":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";
                break;
            case "Error":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-red-500"
                break;
            case "Error":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-yellow-400"
                break;
            default:
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";    
                break;
        }
        toast({
            title: message,
            description: descirption,
            action : <ToastAction altText="Ok">Ok</ToastAction>,
            className : className
        })
    }

    const CreateSection = async ({ newSection } : { newSection: SectionScheme }) => {
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const token = await getToken({ template : "linkscribe-supabase" });
            const currentUserEmail = RefineEmail(user.primaryEmailAddress.emailAddress);

            if(!token) {
                alert("Failed Authorize Token Please Try Again");
                return;
            }

            setServerOperationInterrupted(true);
            setContextSections(prev => [...prev, newSection]);
            await SynchronizeToDexieDB({ sections : contextSections });
            
            //await ClientSideCreateSection({
            //    token : token,
            //    email : currentUserEmail,
            //    sectionData : newSection,
            //    onSuccess() {
            //        setServerOperationInterrupted(false);
            //        SaveContextSections();
            //    },
            //    onError : () => RestoreContextSections()
            //});
        }
        else {
            toast({
                title: "Failed Create Section Please Try Again 😁",
                description: "INTERNAL SERVER ERROR 500",
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
            });

            ToastMessage("No Sections Found", "STORAGE SYSTEM", "Warning");
        }
    }

    const GetSections = async (revalidateFetch? : boolean) => {

        //const cachedData = await DexieGetSections();
        //setOriginalContextSections(cachedData);
        
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const token = await getToken({ template : "linkscribe-supabase" });

            const currentUserEmail = RefineEmail(user.primaryEmailAddress.emailAddress);

            if(!token) {
                alert("Failed Authorize Token Please Try Again");
                return [];
            }

            if(!revalidateFetch)
            {
                //setContextSections(cachedData);
                console.log("INITALIZED FROM CLIENT SIDE STORAGE");
            }
            else if(revalidateFetch)
            {
                console.log("INITIALIZING FROM DATABASE...");
                
                await ClientSideGetSections({
                    token : token,
                    email : currentUserEmail,
                    onSuccess : async (sections) => {
                        console.log("INITALIZED FROM DATABASE");
                        setContextSections(sections);
                        await SynchronizeToDexieDB({ sections : sections });
                    },
                    onEmpty() {  },
                    onError(error) {
                        ToastMessage("Failed Operation During Fetching Sections From Database", "SYSTEM", "Error");
                        console.error("Error While Fetching Sections : ", error);
                    },
                });
                
            }
            
            return contextSections;
        }
        return [];
    }

    const UpdateSection = async ({currentSection, updatedSection} : { currentSection : SectionScheme, updatedSection : SectionScheme }) => {
        const currentUserEmail = RefineEmail(user?.primaryEmailAddress?.emailAddress || "");
        const filteredSections = contextSections.map((section) => section === currentSection ? { ...section, ...updatedSection } : section );
        setContextSections(filteredSections);

        try
        {
            if(currentSection == updatedSection) return;
            //const response = await updateSection(currentUserEmail, currentSection.id, JSON.stringify(updatedSection), window.location.origin);
            SaveContextSections();
            await SynchronizeToDexieDB({ sections : contextSections });
        }
        catch (error : any) {
            RestoreContextSections();
            toast({
                title: "Failed To Update Please Be Paitent Your Data Synced",
                description: "INTERNAL SERVER ERROR 500",
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
            });
            throw new Error(error);
        }
    }
    
    const DeleteSections = async (id:string) => {
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const token = await getToken({ template : "linkscribe-supabase" });

            if(!token) {
                alert("Failed Authorize Token Please Try Again");
                return;
            }

            const totalContextsLength = contextSections.length;
            const decreamnentAmount = 1;

            if(totalContextsLength - decreamnentAmount < 1) {
                ToastMessage("You Must Have Atleast 1 Document In Order To Maintain Storage Invalidation", "STORAGE", "Warning");
                return;
            }
            setContextSections(prevSections => {
                const updatedSections = prevSections.filter(section => section.id !== id);
                return updatedSections;
            })

            await SynchronizeToDexieDB({ sections : contextSections });
            
            /*
            await ClientSideDeleteSection({
                token : token,
                section_id : id,
                onSuccess() {
                    ToastMessage("Successfully Deleted ${id}", "STORAGE", "Status");
                    SaveContextSections();
                },
                onError(error) {
                    ToastMessage("Failed To Delete Section Retry Few Seconds Letter.", "STORAGE", "Error");
                    RestoreContextSections();
                },
            })
            */
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
        GetSections();       
    }, [isSignedIn, isLoaded, user]);
    

    useEffect(() => {
        const FetchDexieDBCache = async () => {
            const cachedData = await DexieGetSections();
            setOriginalContextSections(cachedData);
            setContextSections(cachedData);
            setIsCacheLoaded(true);  // Mark cache as loaded
        }
    
        FetchDexieDBCache();
    }, [user, isSignedIn, isLoaded]);
    
    useEffect(() => {
        const currentTimeoutID = setTimeout(() => {
            if (!isCacheLoaded) return; // Prevent synchronization before cache is loaded
    
            // Check if contextSections is different from originalContextSections
            if (isCacheLoaded && !isEqual(contextSections, originalContextSections)) {
                const SyncToDexieDB = async () => {
                    await SynchronizeToDexieDB({ sections: contextSections });
                }
        
                SyncToDexieDB();
            }
        }, 500);

        return () => clearTimeout(currentTimeoutID);
    }, [contextSections, isCacheLoaded, originalContextSections]);

    const Sync = async () => {
        if (isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = RefineEmail(user?.primaryEmailAddress?.emailAddress ?? "");
            const token = await getToken({ template: "linkscribe-supabase" }) ?? "";
            await SynchronizeToSupabase({ token, email : currentUserEmail});
        }
    }
    

    const contextValue: SectionContextType = {
        CreateSection,
        GetSections,
        UpdateSection,
        DeleteSections,
        SaveContextSections,
        RestoreContextSections,
        Sync,

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