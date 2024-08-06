import { DexieDB } from "@/database/dexie";
import { SectionScheme } from "@/scheme/Section";

import { GetSections } from "../supabase/sections/getAllSections";
import { DeleteSection } from "../supabase/sections/deleteSection";
import { CreateSection } from "../supabase/sections/createSections";
import { UpdateSection } from "../supabase/sections/updateSection";
import { DexieGetSections } from "./DexieSections";

//import { isEqual } from "lodash";
import { DifferenceComparatorAlgorithm } from "@/helpers/DiffAlgorithm";

//import { isEqual } from "lodash";

export async function SynchronizeToDexieDB(sections: SectionScheme[]) {
    // Get all current sections in DexieDB
    const currentSections = await DexieDB.sections.toArray();
    const currentSectionIds = new Set(currentSections.map(section => section.id));

    for (const section of sections) {
        const existingSection = await DexieDB.sections.get(section.id);

        if (existingSection) {
            // Update existing section if there are changes
            if (!isEqual(existingSection, section)) {
                await DexieDB.sections.update(section.id, {
                    title: section.title,
                    linksLayout: section.linksLayout,
                    selfLayout: section.selfLayout,
                    created_at: section.created_at,
                    totalLinksCount: section.totalLinksCount,
                    _deleted: section._deleted,
                    section_ref : section.section_ref,
                    links : section.links
                });
            }
        } else {
            // Add new section
            await DexieDB.sections.add(section);
        }

        for (const link of section.links) {
            const existingLink = await DexieDB.links.get(link.id);
            if (existingLink) {
                // Update existing link if there are changes
                if (!isEqual(existingLink, link)) {
                    await DexieDB.links.update(link.id, link);
                }
            } else {
                // Add new link
                await DexieDB.links.add(link);
            }
        }

        currentSectionIds.delete(section.id); // Remove processed section ID from the set
    }

    // Delete sections that are no longer present
    for (const id of Array.from(currentSectionIds)) {
        await DexieDB.sections.where('id').equals(id).delete();
        await DexieDB.links.where('section_ref').equals(id).delete();
    }
}

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

export async function SynchronizeToSupabase(token: string, email: string) {
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