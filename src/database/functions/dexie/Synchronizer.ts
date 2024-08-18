import { SectionScheme } from "@/scheme/Section";

import { GetSections } from "../supabase/sections/getAllSections";
import { DexieGetSections } from "./DexieSections";

//import { isEqual } from "lodash";
import { DifferenceComparatorAlgorithm } from "@/helpers/DiffAlgorithm";

//import { isEqual } from "lodash";

// Function to get new sections from Dexie based on new IDs
function getNewSections(dexieSections: SectionScheme[], newIds: Set<string>): SectionScheme[] {
    const currentSections = dexieSections.filter(section => newIds.has(section.id));
    return [...new Set(removeExtraSections(currentSections))];
}

function removeExtraSections(sections: SectionScheme[]): SectionScheme[] {
    return sections.map(section => ({
        ...section
    }));
}

export async function SynchronizeToSupabase(token: string, email: string)
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

        
    } catch (error) {
        console.error("Error during synchronization:", error);
    }
};

// Helper function to deeply compare two objects
function isEqual(obj1: object, obj2: object): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}