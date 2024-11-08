import { DexieDB } from "@/database/dexie/DexieDB";
import { DexieGetCacheImage, DexieGetCacheImages } from "@/database/dexie/helper/DexieCacheImages";
import { ICacheImage } from "@/scheme/CacheImage";
import { CompressImageFromUrl } from "../../helpers/CompressImageAutoFromUrl";
import { RefineEmail } from "../../helpers/RefineEmail";
import { CompressImageToBlob } from "../../helpers/CompressImageToBlob";
import { DetermineInputSource } from "@/helpers/ICM/DetermineInputSource";
import { AddImageToCache } from "@/helpers/Dexie/AddImageToCache";

interface IUploadToCache
{
    cacheEncoderDecoder? : "binary" | "blob" | "base64";
    compressMode? : "UTC" | "FTC" | "BTC" | "auto",
    metaData? : {
        id : string;
        ref : string;
        url : string;
    };
    image : ICacheImage | string | File | Blob;
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

    private static getExistingCacheImages() {
        return DexieGetCacheImages({ email : this.email });
    }

    public static InitializeCacheManager ({ email } : { email : string }) {
        ImageCacheManager.email = email;
    }


    static async uploadToCache ({ image, onError, compressMode, metaData, onCallback } : IUploadToCache) {
        
        const { type } = DetermineInputSource({ image : image as File | Blob | string });

        if(type == "File" && compressMode == "FTC") {

            if(!metaData) {
                onError?.("metaData is required when compressMode is UTC | FTC");
                return;
            }

            onCallback?.("Compressing...");
            const compressedOutput = await CompressImageToBlob(image as File);
            onCallback?.("Compression Complete")
            const cacheEntry : ICacheImage = {
                id : metaData.id,
                blob : compressedOutput,
                ref : RefineEmail(metaData.ref),
                url : metaData.url
            }
            AddImageToCache({ cacheEntry, options : { overwrite : true } })
        }

        if(type == "Blob" && compressMode == "BTC") {
            if(!metaData) {
                onError?.("metaData is required when compressMode is UTC | FTC");
                return;
            }
            onCallback?.("Caching Started");
            const cacheEntry : ICacheImage = {
                id : metaData.id,
                blob : image as Blob,
                ref : RefineEmail(metaData.ref),
                url : metaData.url
            }
            AddImageToCache({ cacheEntry, options : { overwrite : true } })
        }

        if(type == "URL" && compressMode == "UTC") {
            if(!metaData) {
                onError?.("metaData is required when compressMode is UTC | FTC");
                return;
            }

            onCallback?.("Compressing...");
            const compressedOutput = await CompressImageFromUrl(image as string);
            onCallback?.("Compressed");

            const cacheEntry : ICacheImage = {
                id : metaData.id,
                blob : compressedOutput,
                ref : RefineEmail(metaData.ref),
                url : image as string
            }
            AddImageToCache({ cacheEntry, options : { overwrite : true } })
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