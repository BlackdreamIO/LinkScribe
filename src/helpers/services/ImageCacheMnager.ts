import { DexieDB } from "@/database/dexie/DexieDB";
import { DexieGetCacheImage, DexieGetCacheImages } from "@/database/dexie/helper/DexieCacheImages";
import { ICacheImage } from "@/scheme/CacheImage";

interface IUploadToCache {
    email : string;
    image : ICacheImage;
    onError? : (error : any) => void;
}

export class ImageCacheManager {

    private static email : string;
    private static id : string;
    private static image: Blob;

    constructor() {};

    public static InitializeCacheManager ({ email } : { email : string }) {
        ImageCacheManager.email = email;
    }

    static async uploadToCache ({ image, onError } : IUploadToCache) {
        const existingCacheImage = await DexieDB.cacheImages.toArray();

        if(existingCacheImage.find(x => x.id === image.id))
        {
            try
            {
                let hasError = false;
                await this.deleteFromCache({ id : image.id, onError(error) {
                    hasError = true;
                    onError?.(error);
                    return;
                }});

                if(!hasError) await DexieDB.cacheImages.add(image);   
            }
            catch (error) {
                onError?.(error);
            }
        }
        else {
            try {
                await DexieDB.cacheImages.add(image);   
            }
            catch (error) {
                onError?.(error);
            }
        }
    }

    static async deleteFromCache ({ id, onError } : { id : string, onError? : (error : any) => void }) {
        try
        {   
            const cacheImage = await DexieGetCacheImage({ id, email : this.email });
            
            if(cacheImage) {
                await DexieDB.cacheImages.delete(cacheImage.id);
            }
            else {
                // not found
            }
        }
        catch (error) {
            onError?.(error);
        }
    }

    static async revalidateCache ({ id, onError } : { id : string, onError? : (error : any) => void }) {
        try {
            const cacheImage = await DexieGetCacheImage({ id, email : this.email });

            if(cacheImage) {
                await DexieDB.cacheImages.delete(id);
                await DexieDB.cacheImages.add(cacheImage);
            }
        }
        catch (error) {
            onError?.(error);
        }
    }
}