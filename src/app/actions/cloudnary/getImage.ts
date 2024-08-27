"use server"

import { RefineEmail } from "@/helpers";
import { Cloudinary, cloudinaryConfig } from "@/lib/Cloudinary";

interface IGetCloudinaryImage {
    publicID : string;
    userEmail : string;
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
    if(args.publicID.length < 1 || args.userEmail.length < 1)
    {
        return {
            imageURL : "",
            error : "Missing Required Parameters",
            hasError : true
        }
    }

    try
    {
        const result = await Cloudinary.api.resource(`${RefineEmail(args.userEmail)}/${args.publicID}`);

        if(result.error.http_code !== 200) {
            return {
                imageURL : "",
                error : result?.error?.message,
                hasError: true
            }
        }

        else {   
            return {
                imageURL : result?.secure_url ? result.secure_url : "",
                error : null,
                hasError: false
            };
        }
    }
    catch (error : any) {
        return {
            imageURL : "",
            error : error?.error,
            hasError: true
        }
    }
}