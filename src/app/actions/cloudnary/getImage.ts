"use server"

import { RefineEmail } from "@/helpers/NormalizeEmail";
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

        if(!result || result == undefined || result == null){
            return {
                imageURL : "",
                error : "No Image Found",
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
    catch (error) {
        return {
            imageURL : "",
            error : error,
            hasError: true
        }
    }
}