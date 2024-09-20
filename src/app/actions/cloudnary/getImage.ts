"use server"

import { RefineEmail } from "@/helpers";
import { Cloudinary, cloudinaryConfig } from "@/lib/Cloudinary";

interface IGetCloudinaryImage {
    publicID : string;
}

interface IGetCloudinaryImageOutput {
    imageURL : string;
    hasError : boolean;
    error : any | null;
}

/**
 * Retrieves an image from Cloudinary based on the provided public ID and user email.
 *
 * @param {IGetCloudinaryImage} args - An object containing the public ID and user email.
 * @return {Promise<IGetCloudinaryImageOutput>} A promise resolving to an object containing the image URL, error message, and error status.
 */
export async function GetCloudinaryImage(args : IGetCloudinaryImage) : Promise<IGetCloudinaryImageOutput>
{
    if(args.publicID.length < 1)
    {
        return {
            imageURL : "",
            error : "Missing Required Parameters",
            hasError : true
    }
    }

    try
    {
        const result = await Cloudinary.api.resource(args.publicID, {transformations : []});

        if (result.error) {
            return {
                imageURL : "",
                error : result.error.message,
                hasError: true
            }
        }

        return {
            imageURL : result.secure_url || "",
            error : null,
            hasError: false
        };
    }
    catch (error : any) {
        return {
            imageURL : "",
            error : error?.error,
            hasError: true
        }
    }
}