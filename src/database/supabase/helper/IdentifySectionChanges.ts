import { isEqual } from "@/helpers";
import { SectionScheme } from "@/scheme/Section";

export function IdentifySectionChanges({ dexieSections, supabaseSections }: { dexieSections: SectionScheme[], supabaseSections: SectionScheme[] }) {
    // Sort both arrays based on the 'id' property
    const sortedSupabaseSections = supabaseSections.sort((a, b) => a.id.localeCompare(b.id));
    const sortedDexieSections = dexieSections.sort((a, b) => a.id.localeCompare(b.id));

    // Create sets of IDs for quick lookup
    const supabaseSectionIds = new Set(sortedSupabaseSections.map(section => section.id));
    const dexieSectionIds = new Set(sortedDexieSections.map(section => section.id));

    // Generate Ids
    const createdIds = new Set([...dexieSectionIds].filter(id => !supabaseSectionIds.has(id))); // Get IDs of newly created sections
    const deletedIds = new Set([...supabaseSectionIds].filter(id => !dexieSectionIds.has(id))); // Get IDs of deleted sections
    const updatedIds = new Set([...dexieSectionIds].filter(id => supabaseSectionIds.has(id))); // Get IDs of updated sections
    
    
    const filteredUpdatedSections: SectionScheme[] = sortedDexieSections.filter(section => {
        const supabaseSection = sortedSupabaseSections.find(s => s.id === section.id);
    
        return supabaseSection && !isEqual(
            {
                ...section,
                links_layout: { ...section.links_layout }
            },
            {
                ...supabaseSection,
                links_layout: { ...supabaseSection.links_layout }
            }
        );
    });

    // Get Sections
    const newSections = getNewSections(sortedDexieSections, createdIds);
    const deletedSections = getNewSections(sortedSupabaseSections, deletedIds);
    const updatedSections = getNewSections(filteredUpdatedSections, updatedIds);

    return { newSections, deletedSections, updatedSections };
}

function getNewSections(dexieSections: SectionScheme[], newIds: Set<string>): SectionScheme[] {
    const currentSections = dexieSections.filter(section => newIds.has(section.id));
    return [...new Set(removeExtraSections(currentSections))];
}

const removeExtraSections = (sections: SectionScheme[]): SectionScheme[] => sections.map(section => ({...section}));