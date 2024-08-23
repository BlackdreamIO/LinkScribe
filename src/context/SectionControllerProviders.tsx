'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { SectionScheme } from '@/scheme/Section';

import useLocalStorage from '@/hook/useLocalStorage';
import { useSendToastMessage } from '@/hook/useSendToastMessage';

import { GetSections as ClientSideGetSections } from '@/database/functions/supabase/sections/getAllSections';
import { CreateSection as ClientSideCreateSection } from '@/database/functions/supabase/sections/createSections';
import { CreateLink as ClientSideCreateLink } from '@/database/functions/supabase/links/createLink';

import { isEqual, SynchronizeToDexieDB, SynchronizeToSupabase } from '@/helpers';
import { RefineEmail } from '@/helpers/NormalizeEmail';
import { LinkScheme } from '@/scheme/Link';
import { DexieGetSectionsByEmail } from '@/database/functions/dexie/DexieSectionByEmail';
import { SyncStatus } from '@/types/Sync';

//PouchDB.plugin(PouchDBLocalStorageAdapter);

interface SectionContextData {
    contextSections: SectionScheme[];
    setContextSections: Dispatch<SetStateAction<SectionScheme[]>>;

    enableFilterContextSections : boolean;
    setEnableFilterContextSections: Dispatch<SetStateAction<boolean>>;

    syncStatus : SyncStatus;
    setSyncStatus : Dispatch<SetStateAction<SyncStatus>>;
}

export interface SectionContextType extends SectionContextData {
    CreateSection: ({ newSection } : { newSection: SectionScheme }) => void;
    GetSections: (revalidateFetch? : boolean) => void;
    UpdateSection: ({currentSection, updatedSection} : { currentSection : SectionScheme, updatedSection : SectionScheme }) => void;
    DeleteSections: (id: string) => any;

    TransferSection: ({ email, sectionToTransfer, importCustomLinks, importLinks, links } : { email : string, importLinks : boolean, sectionToTransfer : SectionScheme, importCustomLinks : boolean, links : LinkScheme[] }) => void;

    SaveContextSections: () => void;
    RestoreContextSections: () => void;
    Sync: () => void;
}

type SectionContextProviderProps = {
    children : ReactNode;
}

const SectionController = createContext<SectionContextType | undefined>(undefined);

export const useSectionController = () => useContext(SectionController)!;

export const SectionControllerProvider = ({children} : SectionContextProviderProps) => {

    const [contextSections, setContextSections] = useState<SectionScheme[]>([]);
    const [originalContextSections, setOriginalContextSections] = useState<SectionScheme[]>([]);

    const [serverOperationInterrupted, setServerOperationInterrupted] = useLocalStorage<boolean>('operationInterrupted', false); // track server operation interruption

    const [syncStatus, setSyncStatus] = useState<SyncStatus>("Synced");

    {/* the filteredContextSections data will come from the component that does the filtering */}
    const [enableFilterContextSections, setEnableFilterContextSections] = useState<boolean>(false);
    const [isCacheLoaded, setIsCacheLoaded] = useState(false);

    const { isSignedIn, isLoaded, user } = useUser();
    const { getToken } = useAuth();

    const { ToastMessage } = useSendToastMessage();

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
            await SynchronizeToDexieDB({ sections : [...contextSections, newSection], email : currentUserEmail })
                .catch(() => ToastMessage({message : "Failed Create Section Please Try Again", description : "INTERNAL SERVER ERROR 500", type : "Error"}));
        }
    }

    const GetSections = async (revalidateFetch? : boolean) => {
        
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const cachedData = await DexieGetSectionsByEmail(user.primaryEmailAddress.emailAddress);
            const token = await getToken({ template : "linkscribe-supabase" });
            const currentUserEmail = RefineEmail(user.primaryEmailAddress.emailAddress);

            if(!token) {
                alert("Failed Authorize Token Please Try Again");
                return [];
            }

            if(!revalidateFetch && cachedData && cachedData.length > 0)
            {
                console.log("INITALIZED FROM CLIENT SIDE STORAGE");
                setOriginalContextSections(cachedData);
                setContextSections(cachedData);
                setIsCacheLoaded(true);  // Mark cache as loaded
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
                        await SynchronizeToDexieDB({ sections : sections, email : currentUserEmail });
                    },
                    onEmpty() {  },
                    onError(error) {
                        ToastMessage({message : "Failed Operation During Fetching Sections From Database", description : "SYSTEM", type : "Error"});
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
            SaveContextSections();
            await SynchronizeToDexieDB({ sections : contextSections, email : currentUserEmail });
        }
        catch (error : any) {
            RestoreContextSections();
            ToastMessage({ message : "Failed To Update Please Be Paitent Your Data Synced", description : "INTERNAL SERVER ERROR 500", type : "Error" })
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
                ToastMessage({ message : "You Must Have Atleast 1 Document In Order To Maintain Storage Invalidation", description : "STORAGE", type : "Warning"});
                return;
            }
            setContextSections(prevSections => {
                const updatedSections = prevSections.filter(section => section.id !== id);
                return updatedSections;
            })

            await SynchronizeToDexieDB({ sections : contextSections, email : user.primaryEmailAddress.emailAddress });
        }
    }

    /**
     * Transfers a section to a new email address, creating a new section and links if necessary.
     *
     * @param {string} email - The email address to transfer the section to.
     * @param {SectionScheme} sectionToTransfer - The section to transfer.
     * @param {boolean} importCustomLinks - Whether to import custom links.
     * @param {LinkScheme[]} links - The links to import if importCustomLinks is true.
     * @param {boolean} importLinks - Whether to import links from the original section.
     * @return {Promise<void>} A promise that resolves when the transfer is complete.
     */
    const TransferSection = async ({ email, sectionToTransfer, importCustomLinks, links, importLinks } : { email : string, importLinks: boolean, sectionToTransfer : SectionScheme, importCustomLinks : boolean, links : LinkScheme[] }) => {
        const token = await getToken({ template : "linkscribe-supabase" });

        const sections = await DexieGetSectionsByEmail(RefineEmail(email));

        if(sections && sections.find(section => section.title === sectionToTransfer.title)) {
            ToastMessage({message : "Section Already Exists", description : "SYSTEM", type : "Error"});
            return;
        }
        
        if(!token || !isSignedIn) return;

        const randomUniqeSectionID = crypto.randomUUID().slice(0, 12);

        const newSection : SectionScheme = {
            ...sectionToTransfer,
            id: randomUniqeSectionID,
            section_ref : RefineEmail(email),
            links : importLinks ? sectionToTransfer.links : []
        };

        const newLinks : LinkScheme[] = links.map((link) => ({...link, id : crypto.randomUUID().slice(0, 8), ref : randomUniqeSectionID}));

        await ClientSideCreateSection({email : RefineEmail(email), sectionData : newSection, token : token});

        if(importCustomLinks && !importLinks) {
            for(const link of newLinks) {
                await ClientSideCreateLink({linkData : link, token : token});
            }
        }
        else if(importLinks && !importCustomLinks) {
            for(const link of newSection.links) {
                await ClientSideCreateLink({linkData : link, token : token});
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
        GetSections();       
    }, [isSignedIn, isLoaded, user]);
    
    useEffect(() => {
        const currentTimeoutID = setTimeout(() => {
            if (!isCacheLoaded) return; // Prevent synchronization before cache is loaded

            // Check if contextSections is different from originalContextSections
            if (isCacheLoaded && !isEqual(contextSections, originalContextSections)) {
                const SyncToDexieDB = async () => {
                    if(!user || !user.primaryEmailAddress) return;
                    await SynchronizeToDexieDB({ sections: contextSections, email : user.primaryEmailAddress?.emailAddress });
                }
        
                SyncToDexieDB();
            }
        }, 500);

        return () => clearTimeout(currentTimeoutID);
    }, [contextSections, isCacheLoaded, originalContextSections, user, isSignedIn]);

    const Sync = async () => {
        const token = await getToken({ template: "linkscribe-supabase" }) ?? "";
        if (isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = RefineEmail(user?.primaryEmailAddress?.emailAddress ?? "");
            await SynchronizeToSupabase({ token, email : currentUserEmail, onStatusCallback : setSyncStatus });
        }
        else{

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
        TransferSection,

        contextSections,
        setContextSections,
        enableFilterContextSections,
        setEnableFilterContextSections,
        syncStatus,
        setSyncStatus
    };

    return (
        <SectionController.Provider value={contextValue}>
            {children}
        </SectionController.Provider>
    )
}