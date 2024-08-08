import { DexieDB } from "@/database/dexie";
import { SectionScheme } from "@/scheme/Section";
import { isEqual } from "./isEqual";

interface ISynchronizeToDexieDB {
    sections : SectionScheme[];
}

export async function SynchronizeToDexieDB({ sections } : ISynchronizeToDexieDB) {
    // Get all current sections in DexieDB
    const currentSections = await DexieDB.sections.toArray();
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
                        linksLayout: section.linksLayout,
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

            console.log(existingSection?.links);

            for (const link of section.links) {
                const existingLink = await DexieDB.links.get(link.id);
                if (existingLink) {
                    // Update existing link if there are changes
                    if (!isEqual(existingLink, link)) {
                        await DexieDB.links.update(link.id, {
                            created_at : link.created_at,
                            title : link.title,
                            url : link.url,
                            visitCount : link.visitCount
                        });
                    }
                    else {
                        //await DexieDB.links.add(link);
                    }
                }
                else { await DexieDB.links.add(link); }
            }

            currentSectionIds.delete(section.id); // Remove processed section ID from the set
        }

        // Delete sections that are no longer present
        for (const id of Array.from(currentSectionIds)) {
            await DexieDB.sections.where('id').equals(id).delete();
            await DexieDB.links.where('section_ref').equals(id).delete();
        }
    }
    catch (error) {
        throw new Error(error as any);    
    }
}