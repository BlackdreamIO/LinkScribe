'use client'

import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { SectionScheme } from '@/scheme/Section';

import useLocalStorage from '@/hook/useLocalStorage';
import { useSendToastMessage } from '@/hook/useSendToastMessage';

import { GetSections as ClientSideGetSections } from '@/database/actions/sections/getAllSections';
import { CreateSection as ClientSideCreateSection } from '@/database/actions/sections/createSections';
import { CreateLink as ClientSideCreateLink } from '@/database/actions/links/createLink';

import { isEqual, RefineEmail } from '@/helpers';
import { LinkScheme } from '@/scheme/Link';
import { DexieGetSectionsByEmail } from '@/database/dexie/helper/DexieSectionByEmail';
import { SyncStatus } from '@/types/Sync';
import { SynchronizeToDexieDB } from '@/database/dexie/functions/SynchronizeToDexie';
import SynchronizeToSupabase from '@/database/supabase/functions/SynchronizeToSupabase';

//PouchDB.plugin(PouchDBLocalStorageAdapter);

interface SectionContextData {
    contextSections: SectionScheme[];
    setContextSections: Dispatch<SetStateAction<SectionScheme[]>>;
    
    databaseContextSections: SectionScheme[];
    setDatabaseContextSections: Dispatch<SetStateAction<SectionScheme[]>>;

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
    const [databaseContextSections, setDatabaseContextSections] = useState<SectionScheme[]>([]);

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

            setContextSections(prev => [...prev, newSection]);
            await SynchronizeToDexieDB({ sections : [...contextSections, newSection], email : currentUserEmail })
                .catch(() => ToastMessage({message : "Failed Create Section Please Try Again", description : "INTERNAL SERVER ERROR 500", type : "Error"}));
        }
    }

    const GetSections = async (revalidateFetch? : boolean) => {
        
        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const cachedData = await DexieGetSectionsByEmail({
                email : user.primaryEmailAddress.emailAddress,
                onError(error) {
                    ToastMessage({ message : "Please Restart Your Browser Or Try Again Or Clean Your Device Storage", description : String(error), type : "Error" });
                },
            });
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
                        setOriginalContextSections(sections);
                        setDatabaseContextSections(sections);
                        await SynchronizeToDexieDB({ sections : sections, email : currentUserEmail })
                            .catch(() => ToastMessage({message : "Failed To Sync Data Indexed DB", description : "STORAGE", type : "Error"}));
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
        
        const updateSectionIndex = contextSections.findIndex((section) => section.id === updatedSection.id);

        if (updateSectionIndex !== -1) {
            // Create a new array with only the updated section
            const updatedSections = [
                ...contextSections.slice(0, updateSectionIndex),
                updatedSection,
                ...contextSections.slice(updateSectionIndex + 1)
            ];
        
            setContextSections(updatedSections); // Update the state with the updated sections
        }
        
        try
        {
            if(currentSection == updatedSection) return;
            SaveContextSections();
            await SynchronizeToDexieDB({ sections : contextSections, email : currentUserEmail })
                .catch(() => ToastMessage({message : "Failed To Sync Data Indexed DB", description : "STORAGE", type : "Error"}));
        }
        catch (error : any) {
            RestoreContextSections();
            ToastMessage({ message : "Failed To Update Please Be Paitent Your Data Synced", description : "INTERNAL SERVER ERROR 500", type : "Error" })
            console.error("Error While Updating Section : ", error);
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
            SaveContextSections();

            await SynchronizeToDexieDB({ sections : contextSections, email : user.primaryEmailAddress.emailAddress })
                .catch(() => ToastMessage({message : "Failed To Sync Data Indexed DB", description : "STORAGE", type : "Error"}));
        }
    }

    const TransferSection = async ({ email, sectionToTransfer, importCustomLinks, links, importLinks } : { email : string, importLinks: boolean, sectionToTransfer : SectionScheme, importCustomLinks : boolean, links : LinkScheme[] }) => {
        const token = await getToken({ template : "linkscribe-supabase" });

        const sections = await DexieGetSectionsByEmail({
               email : RefineEmail(email),
               onError(error) {
                   ToastMessage({ message : "Please Restart Your Browser Or Try Again Or Clean Your Device Storage", description : String(error), type : "Error" });
               }
        });

        if(sections && sections.find(section => section.title === sectionToTransfer.title)) {
            ToastMessage({message : "Section Already Exists", description : "SYSTEM", type : "Warning"});
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

        const modifiedLinks : LinkScheme[] = links.map((link) => ({...link, id : crypto.randomUUID().slice(0, 8), ref : randomUniqeSectionID}));

        await ClientSideCreateSection({email : RefineEmail(email), sectionData : newSection, token : token, onSuccess : async () => {
            const linkDataArray = (importCustomLinks && !importLinks ? modifiedLinks : newSection.links).map(link => ({
                id: link.id,
                title: link.title,
                url: link.url,
                ref: link.ref,
                created_at: new Date(link.created_at).toISOString(),
                image: link.image
            }));
            
            await ClientSideCreateLink({useBulkInsert : true, bulkData : linkDataArray, token : token, onError(error) {
                ToastMessage({message : `There were some error during creating link to : ${newSection.title}`, description : String(error), type : "Error"});
            }});

            const transferAccountLocalSections = await DexieGetSectionsByEmail({
                email
            }) ?? [];

            await SynchronizeToDexieDB({ sections : [...transferAccountLocalSections, newSection], email : RefineEmail(email) });
            ToastMessage({message : "Section Successfully Transferred", description : "SYSTEM", type : "Success"});
        },
        onError(error) {
            ToastMessage({message : "Failed To Transfer Please Be Paitent Your Data Synced", description : String(error), type : "Error"});
        },});
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
        const filteredContextSection = contextSections.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setContextSections(filteredContextSection);          
    }, [contextSections])
    
    
    useEffect(() => {
        const currentTimeoutID = setTimeout(() => {
            if (!isCacheLoaded) return; // Prevent synchronization before cache is loaded

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
            await SynchronizeToSupabase({ token, email : currentUserEmail, callback : setSyncStatus, onFetch : setDatabaseContextSections });
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
        databaseContextSections,
        setDatabaseContextSections,
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