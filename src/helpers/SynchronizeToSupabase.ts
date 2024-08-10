import { SectionScheme } from "@/scheme/Section";

import { GetSections } from "@/database/functions/supabase/sections/getAllSections";
import { DexieGetSections } from "@/database/functions/dexie/DexieSections";
import { isEqual } from "./isEqual";

import { CreateSection } from "@/database/functions/supabase/sections/createSections";
import { DeleteSection } from "@/database/functions/supabase/sections/deleteSection";
import { UpdateSection } from "@/database/functions/supabase/sections/updateSection";

interface ISynchronizeToSupabase {
    token : string;
    email : string;
    
    useCacheSections? : boolean;
    sections? : SectionScheme[];

    onSyncSuccess? : () => void;
    onSyncError? : (error : any) => void;
}

/**
 * Synchronizes local sections with Supabase.
 *
 * This function fetches sections from Supabase, compares them with local sections,
 * and updates Supabase with new, deleted, or updated sections.
 *
 * @param {ISynchronizeToSupabase} options - synchronization options
 * @param {string} options.email - user email
 * @param {string} options.token - authentication token
 * @param {(error: any) => void} [options.onSyncError] - error callback
 * @return {Promise<void>}
 */
export async function SynchronizeToSupabase({ email, token, onSyncError } : ISynchronizeToSupabase)
{
    try {
        // Fetch sections from Supabase
        const supabaseSections: SectionScheme[] = await GetSections({
            email,
            token,
            onSuccess: (data) => data,
            onError: (error) => console.error("Error fetching sections from Supabase:", error)
        });

        const dexieSections = await DexieGetSections();

        // Sort both arrays based on the 'id' property
        const sortedSupabaseSections = supabaseSections.sort((a, b) => a.id.localeCompare(b.id));
        const sortedDexieSections = dexieSections.sort((a, b) => a.id.localeCompare(b.id));

        // Create sets of IDs for quick lookup
        const supabaseIds = new Set(sortedSupabaseSections.map(section => section.id));
        const dexieIds = new Set(sortedDexieSections.map(section => section.id));

        const newIds = new Set([...dexieIds].filter(id => !supabaseIds.has(id))); // Get IDs Of Newly Created Sections
        const deletedIds = new Set([...supabaseIds].filter(id => !dexieIds.has(id))); // Get IDs Of Deleted Sections
        const updatedIds = new Set([...dexieIds].filter(id => supabaseIds.has(id))); // Get IDs Of Updated Sections
        
        const updatedSectionss: SectionScheme[] = sortedDexieSections.filter((section) => {
            const supabaseSection = sortedSupabaseSections.find((s) => s.id === section.id);
            return supabaseSection && !isEqual({...section}, {...supabaseSection});
        })

        const newSections = getNewSections(sortedDexieSections, newIds);
        const deletedSections = getNewSections(sortedSupabaseSections, deletedIds);
        const updatedSections = getNewSections(updatedSectionss, updatedIds);

        console.log({ Added : newSections, Deleted : deletedSections, Updated : updatedSections });
    
        await CreateSectionToSupabase({ email, sections : newSections, token, onSyncError : (e) => onSyncError?.(e) });
        await DeleteSectionToSupabase({ sections : deletedSections, token, onSyncError : (e) => onSyncError?.(e) });
        await UpdateSectionToSupabase({ sections : updatedSections, token, email, onSyncError : (e) => onSyncError?.(e) });
        
    }
    catch (error)
    {
        console.error("Error During Synchronization:", error);
    }
};

let operationDone = 0;

interface ICreateSectionToSupabase {
    email : string;
    token : string;
    sections:SectionScheme[];
    onSyncError : (error : any) => void;
}

async function CreateSectionToSupabase({ email, token, sections, onSyncError } : ICreateSectionToSupabase)
{
    let totalOperationCount = sections.length;
    
    if(totalOperationCount === 0) return;

    for (const section of sections) {
        await CreateSection({
            token: token,
            email: email,
            sectionData : section,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error creating sections in Supabase: ${error}`)
        })
    }

    console.log("Synchronization Completed Successfully");

    if(operationDone === totalOperationCount) {
        console.log("All Synchronization");
        operationDone = 0;
    }
}

interface IDeleteSectionToSupabase {
    token : string;
    sections:SectionScheme[];
    onSyncError : (error : any) => void;
}

async function DeleteSectionToSupabase({ token, sections, onSyncError } : IDeleteSectionToSupabase)
{
    let totalOperationCount = sections.length;

    if(totalOperationCount === 0) return;

    for (const section of sections) {
        await DeleteSection({
            token: token,
            section_id : section.id,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error deleting section in Supabase: ${error}`)
        })
    }

    console.log("Synchronization Deleted Completed");

    if(operationDone === totalOperationCount) {
        console.log("All Deletation Synchronization");
        operationDone = 0;
    }
}
interface IUpdateSectionToSupabase {
    email : string;
    token : string;
    sections:SectionScheme[];
    onSyncError : (error : any) => void;
}

async function UpdateSectionToSupabase({ email, token, sections, onSyncError } : IUpdateSectionToSupabase)
{
    let totalOperationCount = sections.length;

    if(totalOperationCount === 0) return;

    console.log("Updated : ", sections);

    for (const section of sections) {
        await UpdateSection({
            token: token,
            email : email,
            sectionData : section,
            onSuccess: (data) => operationDone++,
            onError: (error) => onSyncError(`Error updating section in Supabase: ${error}`)
        })
    }

    console.log("Synchronization Update Completed");

    if(operationDone === totalOperationCount) {
        console.log("All Update Synchronization");
        operationDone = 0;
    }
}



// Function to get new sections from Dexie based on new IDs
function getNewSections(dexieSections: SectionScheme[], newIds: Set<string>): SectionScheme[] {
    const currentSections = dexieSections.filter(section => newIds.has(section.id));
    return [...new Set(removeExtraSections(currentSections))];
}

const removeExtraSections = (sections: SectionScheme[]): SectionScheme[] => sections.map(section => ({...section}));
