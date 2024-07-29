'use client'

import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import { createSection, deleteSection, getSections, updateSection } from '@/app/actions/sectionAPI';
import { SectionScheme } from '@/scheme/Section';
import useLocalStorage from '@/hook/useLocalStorage';
import { ConvertEmailString } from '@/global/convertEmailString';

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from '@/components/ui/toast';
import PouchDB from 'pouchdb';
import PouchDBLocalStorageAdapter from 'pouchdb-adapter-localstorage';

PouchDB.plugin(PouchDBLocalStorageAdapter);

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
            //setContextSections(prev => [...prev, newSection]);

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
                toast({
                    title: "Failed Create Section Please Try Again 😁",
                    description: "INTERNAL SERVER ERROR 500",
                    action : <ToastAction altText="Ok">Ok</ToastAction>,
                    className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
                });
                throw new Error(error);
            }
        }
        else {
            toast({
                title: "Failed Create Section Please Try Again 😁",
                description: "INTERNAL SERVER ERROR 500",
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
            });
        }
    }

    const GetSections = async (revalidateFetch? : boolean) => {

        function prepareDocsForInsert(sections : SectionScheme[]) {
            return sections.map(section => {
              // Map your custom `id` to `_id`
              const { id, ...rest } = section;
              return { _id: id, ...rest };
            });
        }

        if(isSignedIn && isLoaded && user.primaryEmailAddress)
        {
            const currentUserEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const secret = process.env.NEXT_PUBLIC_SUPABASE_ANON;
            
            const uri = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?apikey=${process.env.NEXT_PUBLIC_SUPABASE_ANON}&select=*,sections(*,links(*)),settings(*)&email=eq.${currentUserEmail}`;

            const response = await fetch(uri, {
                next : {
                    revalidate : 0
                },
                method : "GET",
            });
            const data = await response.json();
            console.log(data);
            

            if(true) {
                
                //const x = await getSections(currentUserEmail, window.location.origin);
                
                const db = new PouchDB('my_database_x');

        

        //const xd = await db.allDocs({ include_docs : true });
        //console.log(xd.rows.flatMap((x) => x.doc));
        
        //if(xd) return [];

        //const response = await fetch(`${url}/rest/v1/users?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wZ251enhiaGNxb2F3bHp0b3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg0MjIzMDAsImV4cCI6MjAxMzk5ODMwMH0.mU1IbZVdFsvDTGwPD25mrci7guzxWy582ASOAmONBi8&select=*,sections(*,links(*)),settings(*)&email=eq.mdh560354gmailcom`);
        //const data = await response.json();

        //const sections = await getSections(currentUserEmail, window.location.origin);

        //const docsForInsert = prepareDocsForInsert(data);
//
        //db.bulkDocs(docsForInsert).then((response : any) => {
        //    console.log('Document created successfully:', response);
        //}).catch((err : any) => {
        //      console.error('Error creating document:', err);
        //});
                     
            }

            if(data) {
                setContextSections(data[0].sections ?? []);
            }
            return [];

            /*
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
            */
        }
        else
        {
            //toast({
            //    title: "Failed To Fetch Sections",
            //    description: "INTERNAL SERVER ERROR 500",
            //    action : <ToastAction altText="Ok">Ok</ToastAction>,
            //    className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
            //});

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
                        description: "SYSTEM",
                        action : <ToastAction altText="Ok">Ok</ToastAction>,
                        className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
                    });
                }
            }
            catch (error : any) {
                RestoreContextSections();
                toast({
                    title: "Failed To Delete Section Please Try Again",
                    description: "SYSTEM",
                    action : <ToastAction altText="Try Again">Try Again</ToastAction>,
                    className : "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary"
                });
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
        if(true)
        {
            const currentUserEmail = ConvertEmailString(user?.primaryEmailAddress?.emailAddress || 'mdh560354gmailcom');
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