import { DexieDB } from "@/database/dexie";
import { SectionScheme } from "@/scheme/Section";
import { isEqual } from "./isEqual";
import { DexieGetSectionsByEmail } from "@/database/dexie/helper/DexieSectionByEmail";

interface ISynchronizeToDexieDB {
    email : string;
    sections : SectionScheme[];
}

export async function SynchronizeToDexieDB({ sections, email } : ISynchronizeToDexieDB) {
    // Get all current sections in DexieDB
    const currentSections = await DexieGetSectionsByEmail(email) ?? [];
    const currentSectionIds = new Set(currentSections.map(section => section.id));

    try {
        for (const section of sections)
        {
            const existingSection = await DexieDB.sections.get(section.id);

            if (existingSection) {
                // Update existing section if there are changes
                if (!isEqual(existingSection, section)) {
                    await DexieDB.sections.update(section.id, {
                        title: section.title,
                        links_layout: section.links_layout,
                        selfLayout: section.selfLayout,
                        created_at: section.created_at,
                        totalLinksCount: section.totalLinksCount,
                        _deleted: section._deleted,
                        section_ref : section.section_ref,
                        links : section.links
                    });
                }
            }
            else {
                // Add new section
                await DexieDB.sections.add(section);
            }
            currentSectionIds.delete(section.id); // Remove processed section ID from the set
        }

        // Delete sections that are no longer present
        for (const id of Array.from(currentSectionIds)) {
            await DexieDB.sections.where('id').equals(id).delete();
        }
    }
    catch (error) {
        throw new Error(error as any);    
    }
}