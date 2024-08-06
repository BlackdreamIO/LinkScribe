'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { createSection, deleteSection, getSections, updateSection } from '@/app/actions/sectionAPI';
import { SectionScheme } from '@/scheme/Section';
import useLocalStorage from '@/hook/useLocalStorage';
import { ConvertEmailString } from '@/global/convertEmailString';

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from '@/components/ui/toast';

import { GetSections as ClientSideGetSections } from '@/database/functions/supabase/sections/getAllSections';
import { DeleteSection as ClientSideDeleteSection } from '@/database/functions/supabase/sections/deleteSection';
import { CreateSection as ClientSideCreateSection } from '@/database/functions/supabase/sections/createSections';

import { SynchronizeToDexieDB, SynchronizeToSupabase } from '@/database/functions/dexie/Synchronizer';
import { DexieGetSections } from '@/database/functions/dexie/DexieSections';

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

    const [serverOperationInterrupted, setServerOperationInterrupted] = useLocalStorage<boolean>('operationInterrupted', false); // track server operation interruption

    {/* the filteredContextSections data will come from the component that does the filtering */}
    const [enableFilterContextSections, setEnableFilterContextSections] = useState<boolean>(false);

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
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);

            if(!token) {
                alert("Failed Authorize Token Please Try Again");
                return;
            }

            setServerOperationInterrupted(true);
            setContextSections(prev => [...prev, newSection]);
            
            
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

        const cachedData = await DexieGetSections();
        setOriginalContextSections(cachedData);

        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const token = await getToken({ template : "linkscribe-supabase" });

            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);

            if(!token) {
                alert("Failed Authorize Token Please Try Again");
                return [];
            }

            if(!revalidateFetch && cachedData)
            {
                //setContextSections(cachedData);
                RestoreContextSections();
                console.log("INITALIZED FROM CLIENT SIDE STORAGE");
                //console.log(cachedData);
            }
            else
            {
                console.log("INITIALIZING FROM DATABASE...");
                
                await ClientSideGetSections({
                    token : token,
                    email : currentUserEmail,
                    onSuccess : async (sections) => {
                        console.log("INITALIZED FROM DATABASE");
                        setContextSections(sections);
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
        const currentUserEmail = ConvertEmailString(user?.primaryEmailAddress?.emailAddress || "");
        const filteredSections = contextSections.map((section) => section === currentSection ? { ...section, ...updatedSection } : section );
        setContextSections(filteredSections);

        try
        {
            if(currentSection == updatedSection) return;
            //const response = await updateSection(currentUserEmail, currentSection.id, JSON.stringify(updatedSection), window.location.origin);
            SaveContextSections();
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
        const syncSystem = async () => {
            if (isSignedIn && isLoaded && user && user.primaryEmailAddress) {
                const token = await getToken({ template: "linkscribe-supabase" });

                if (!token) return;

                // Synchronize DexieDB
                await SynchronizeToDexieDB(contextSections);

                // Synchronize Supabase
                if (user.primaryEmailAddress?.emailAddress) {
                    await SynchronizeToSupabase(token, ConvertEmailString(user.primaryEmailAddress.emailAddress));
                }
            }
        };

        syncSystem();
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