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

export async function DexieGetCacheImage({ id, email } : {id: string, email: string})
{
    const refinedCachedImages = await DexieGetCacheImages({ email });
    const filteredCacheImages = refinedCachedImages.find(cacheImage => cacheImage.id === id)?.blob;
    return filteredCacheImages;
}