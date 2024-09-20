import { DexieGetSectionsByEmail } from "@/database/dexie/helper/DexieSectionByEmail";
import { SectionScheme } from "@/scheme/Section";
import { SectionManagerDexie } from "../helper/SectionManagerDexie";
import { DexieGetCacheImages } from "../helper/DexieCacheImages";
import { GetCloudinaryImage } from "@/app/actions/cloudnary/getImage";

interface ISynchronizeToDexieDB {
    email: string;
    sections: SectionScheme[];
}

export async function SynchronizeToDexieDB({ email, sections }: ISynchronizeToDexieDB) {

    const currentSections = await DexieGetSectionsByEmail(email) ?? [];
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

    const { imageURL } = await GetCloudinaryImage({ publicID : links[0].image });

    console.log({
        imageToCache : imageToCache, 
        
        // imageToRevalidate : cached.filter((cacheImage, index, CI) => {
        //     const targetImage = links.findIndex(link => link.id === cacheImage.id);
        //     if(targetImage) {
        //         if(cacheImage.url !== links[targetImage].image) {
        //             return cacheImage.id;
        //         }
        //         return false;
        //     }
        //     return false;
        // })

        imageToRevalidate : [cached[0]?.url, [0], imageURL]
    })
}
