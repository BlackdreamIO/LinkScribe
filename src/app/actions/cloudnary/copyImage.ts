"use server"

import { Cloudinary } from "@/lib/Cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { UploadImageToCloudinary } from "./uploadImage";

interface ICloudinaryCopyImage {
    publicId: string;
    destinationFolder: string;
}

interface ICloudinaryCopyImageOutput {
    publicId: string;
    url: string;
    hasError : boolean;
    error : any;
}

interface ICloudinary extends UploadApiErrorResponse, UploadApiResponse {};

export async function CopyImageToCloudinary({ publicId, destinationFolder } : ICloudinaryCopyImage) : Promise<ICloudinaryCopyImageOutput>
{
    try
    {
        async function blobToString(blob : Blob) {
            const response = new Response(blob);
            const text = await response.text();
            return text;
        }

        const existingImage : ICloudinary = await Cloudinary.api.resource(publicId);
        
        if(existingImage.secure_url) {
            const imageResponse = await fetch(existingImage.secure_url);
            const imageBlob = await imageResponse.blob();

            const imageBlobString = await blobToString(imageBlob);

            const { imageURL, error, publicID } = await UploadImageToCloudinary({
                file : imageBlobString,
                filename : publicId,
                folder : destinationFolder
            })

            return {
                publicId: error ? '' : publicID,
                url: error ? '' : imageURL,
                error : error ? JSON.stringify(error) : null,
                hasError : error == null ? false : true
            };
        }

        return {
            publicId: '',
            url: '',
            error : "coud not found image",
            hasError : true
        };
    }
    catch (error) {
        console.error('Error copying image:', error);
        return {
            publicId: '',
            url: '',
            error : 'JSON.stringify(error)',
            hasError : true
        };
    }
}
