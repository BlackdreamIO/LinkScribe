import { DexieDB } from "@/database/dexie/DexieDB";
import { ICacheImage } from "@/scheme/CacheImage";
import { RefineEmail } from "../RefineEmail";
import { useSendToastMessage } from "@/hook/useSendToastMessage";
import { ImageExistInCache } from "./ImageExistInCache";
import { DeleteImageFromCache } from "./DeleteImageFromCache";

interface IAddImageToCache
{
    cacheEntry : ICacheImage;
    options : {
        overwrite? : boolean;
    }
}

export async function AddImageToCache({ cacheEntry, options } : IAddImageToCache)
{
    const { ToastMessage } = useSendToastMessage();

    const { overwrite } = options;

    try
    {
        if(overwrite) {
            const hasExistingOne = await ImageExistInCache({ id : cacheEntry.id });
            if(hasExistingOne) {
                await DeleteImageFromCache({ id : cacheEntry.id });
            }
        }
        await DexieDB.cacheImages.add(cacheEntry);
    }
    catch (error) {
        ToastMessage({ message : "Failed To Add Image To Local Cache", description : JSON.stringify(error), type : "Error", duration : 2500 });
    }
}