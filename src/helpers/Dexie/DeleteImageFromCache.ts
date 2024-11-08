import { DexieDB } from "@/database/dexie/DexieDB";

export async function DeleteImageFromCache({ id } : { id : string })
{
    await DexieDB.cacheImages.delete(id);
}