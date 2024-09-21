import { ICacheImage } from "@/scheme/CacheImage";
import { DexieDB } from "../DexieDB";
import { LinkScheme } from "@/scheme/Link";
import { RefineEmail } from "@/helpers";

export async function DexieGetCacheImages({ email } : { email : string}) : Promise<ICacheImage[]>
{
    if(!email){
        console.error("An email is required to obtain cache images");
        return [];
    }

    const cacheImages = await DexieDB.cacheImages.toArray();
    const filteredCacheImages = cacheImages.filter(cacheImage => cacheImage.ref === RefineEmail(email));
    return filteredCacheImages;
}

interface IDexieGetCacheImage {
    id: string;
    email: string;
    revalidation? : {
        revalidate : boolean;
        image_url : string;
    }
    onError? : (error : any) => void;
}

export async function DexieGetCacheImage({ id, email, onError, revalidation } : IDexieGetCacheImage) : Promise<Blob | undefined>
{
    try
    {
        const refinedCachedImages = await DexieGetCacheImages({ email });
        const targetCache = refinedCachedImages.find(cacheImage => cacheImage.id === id);

        if(revalidation && revalidation.revalidate) {
            if(!revalidation.image_url) onError?.("Image URL needed to track");
            console.log({
                targetCache : targetCache?.url,
                revalidation : revalidation.image_url,
                isSame : revalidation.image_url == targetCache?.url
            })
            return targetCache?.url === revalidation.image_url ? targetCache.blob : undefined;
        }

        return targetCache?.blob;
    }
    catch (error) {
        onError?.(error);
        return undefined;
    }
}