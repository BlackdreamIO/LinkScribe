import { SectionScheme } from "@/scheme/Section";

import { GetSections } from "@/database/functions/supabase/sections/getAllSections";
import { DexieGetSections } from "@/database/functions/dexie/DexieSections";
import { isEqual } from "./isEqual";
import { CreateSection } from "@/database/functions/supabase/sections/createSections";

interface ISynchronizeToSupabase {
    token : string;
    email : string;
    
    useCacheSections? : boolean;
    sections? : SectionScheme[];

    onSyncSuccess? : () => void;
    onSyncError? : (error : any) => void;
}

export async function SynchronizeToSupabase({ email, token } : ISynchronizeToSupabase)
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

        console.log({
            Added : newSections,
            Deleted : deletedSections,
            Updated : updatedSections
        });

    
        await CreateSectionToSupabase(email, token, newSections);
        
    }
    catch (error)
    {
        console.error("Error During Synchronization:", error);
    }
};

let operationDone = 0;

async function CreateSectionToSupabase(email : string, token : string, sections:SectionScheme[])
{
    let totalOperationCount = sections.length;

    for (const section of sections) {
        await CreateSection({
            token: token,
            email: email,
            sectionData : section,
            onSuccess: (data) => operationDone++,
            onError: (error) => console.error("Error creating sections in Supabase:", error)
        })
    }

    console.log("Synchronization Completed Successfully");

    if(operationDone === totalOperationCount) {
        
    }
}


// Function to get new sections from Dexie based on new IDs
function getNewSections(dexieSections: SectionScheme[], newIds: Set<string>): SectionScheme[] {
    const currentSections = dexieSections.filter(section => newIds.has(section.id));
    return [...new Set(removeExtraSections(currentSections))];
}

const removeExtraSections = (sections: SectionScheme[]): SectionScheme[] => sections.map(section => ({...section}));
