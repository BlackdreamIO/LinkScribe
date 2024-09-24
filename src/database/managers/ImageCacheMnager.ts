import { DexieDB } from "@/database/dexie/DexieDB";
import { DexieGetCacheImage, DexieGetCacheImages } from "@/database/dexie/helper/DexieCacheImages";
import { ICacheImage } from "@/scheme/CacheImage";
import { CompressImageFromUrl } from "../../helpers/CompressImageAutoFromUrl";
import { RefineEmail } from "../../helpers/RefineEmail";
import { CompressImageToBlob } from "../../helpers/CompressImageToBlob";

interface IUploadToCache
{
    cacheEncoderDecoder? : "binary" | "blob" | "base64";
    compressMode? : "UTC" | "FTC" | "auto",
    metaData? : {
        id : string;
        ref : string;
        url : string;
    };
    image : ICacheImage | string | File;
    onCallback? : (callbackStatus : string) => void;
    onError? : (error : any) => void;
}

export class ImageCacheManager {

    private static email : string;
    private cacheEncoderDecoder: "binary" | "blob" | "base64" = "blob"; // default

    constructor({ cacheEncoderDecoder }: { email: string, cacheEncoderDecoder?: "binary" | "blob" | "base64" }) {
        if (cacheEncoderDecoder) {
            this.cacheEncoderDecoder = cacheEncoderDecoder;
        }
    }

    public static InitializeCacheManager ({ email } : { email : string }) {
        ImageCacheManager.email = email;
    }


    static async uploadToCache ({ image, onError, compressMode, metaData, onCallback } : IUploadToCache) {
        
        if(typeof image == "string" || image instanceof File) {
            try
            {
                if(!metaData) {
                    onError?.("metaData is required when compressMode is UTC | FTC");
                    return;
                }

                if(compressMode == "UTC") {
                    
                    if(image instanceof File) {
                        onError?.("URL is required when compressMode is UTC [URL TO COMPRESS AND CACHE]");
                        return;
                    }

                    onCallback?.("Compressing...");
                    const compressedOutput = await CompressImageFromUrl(image);
                    onCallback?.("Compressed");

                    const convertedImage : ICacheImage = {
                        id : metaData.id,
                        blob : compressedOutput,
                        ref : RefineEmail(metaData.ref),
                        url : image
                    }

                    onCallback?.("Caching Started");
                    await this.revalidateCache({ id : metaData.id, onError });
                    await DexieDB.cacheImages.add(convertedImage);
                    onCallback?.("Cached");
                }

                else if(compressMode == "FTC") {
                    if(typeof image == "string") {
                        onError?.("File is required when compressMode is FTC [FILE TO COMPRESS AND CACHE]");
                        return;
                    }
                    onCallback?.("Compressing From File");
                    const compressedOutput = await CompressImageToBlob(image as File);
                    onCallback?.("Compression Complete")
                    const convertedImage : ICacheImage = {
                        id : metaData.id,
                        blob : compressedOutput,
                        ref : RefineEmail(metaData.ref),
                        url : metaData.url
                    }

                    onCallback?.("Caching Started");
                    await this.revalidateCache({ id : metaData.id, onError });
                    await DexieDB.cacheImages.add(convertedImage);
                    onCallback?.("Cached");
                }
            }
            catch (error) {
                onError?.(error);
                console.error(error);
                return;   
            }
        }

        if (typeof image !== "string" && ('id' in image) && image.id) {
            const existingCacheImage = await DexieDB.cacheImages.toArray();

            if(existingCacheImage.find(x => x.id === image.id))
            {
                try
                {
                    let hasError = false;
                    onCallback?.("RM RF -- OLD_CACHE");
                    await this.deleteFromCache({ id : image.id, onError(error) {
                        hasError = true;
                        onError?.(error);
                        return;
                    }});

                    if(!hasError) {
                        await this.revalidateCache({ id : image.id, onError });
                        await DexieDB.cacheImages.add(image);
                    }
                }
                catch (error) {
                    onError?.(error);
                }
            }
            else {
                try {
                    onCallback?.("Caching Started");
                    await this.revalidateCache({ id : image.id, onError });
                    await DexieDB.cacheImages.add(image);
                    onCallback?.("Cached");
                }
                catch (error) {
                    onError?.(error);
                }
            }
        }
    }

    static async deleteFromCache ({ id, onError } : { id : string, onError? : (error : any) => void }) {
        try
        {   
            const cacheImage = await DexieGetCacheImage({ id, email : this.email });
            
            if(cacheImage) {
                await DexieDB.cacheImages.delete(id);
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
            }
        }
        catch (error) {
            onError?.(error);
        }
    }
}