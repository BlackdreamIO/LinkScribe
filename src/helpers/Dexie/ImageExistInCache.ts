import { DexieDB } from "@/database/dexie/DexieDB";

export async function ImageExistInCache({ id } : { id : string })
{
    if (!id) return false;

    const existingCacheImage = await DexieDB.cacheImages.toArray();
    const cacheExists = existingCacheImage.some(x => x.id === id);

    return cacheExists;
}