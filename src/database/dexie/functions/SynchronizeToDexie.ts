import { DexieGetSectionsByEmail } from "@/database/dexie/helper/DexieSectionByEmail";
import { SectionScheme } from "@/scheme/Section";
import { SectionManagerDexie } from "../helper/SectionManagerDexie";
import { DexieGetCacheImages } from "../helper/DexieCacheImages";

interface ISynchronizeToDexieDB {
    email: string;
    sections: SectionScheme[];
}

export async function SynchronizeToDexieDB({ email, sections }: ISynchronizeToDexieDB) {

    const currentSections = await DexieGetSectionsByEmail({email}) ?? [];
    const currentSectionIds = new Set(currentSections.map(section => section.id));

    await SectionManagerDexie.syncSections(sections, currentSectionIds);
    await SectionManagerDexie.removeDeletedSections(currentSectionIds);

    
    const links = sections.flatMap(section => section.links);
    const cached = await DexieGetCacheImages({ email });

    const currentLinks = [...new Set(links.filter(link => link.id && link.image !== '').map(link => link.id))];
    const currentCachedIds = [...new Set(cached.map(image => image.id))];

    const imageToCache = [...new Set(currentLinks)].filter(id => !currentCachedIds.includes(id));
    
    const imageToRevalidate = currentLinks.filter(link => {
        const currentCachedImage = cached.find(image => image.id === link);
        const imageIndex = links.findIndex(n => n.id === link);
        return currentCachedImage?.url;
    });

}
