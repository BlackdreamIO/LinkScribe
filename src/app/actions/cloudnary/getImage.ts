"use server"

import { Cloudinary, cloudinaryConfig } from "@/lib/Cloudinary";

interface IGetCloudinaryImage {
    publicID : string;
}

interface IGetCloudinaryImageOutput {
    imageURL : string;
    error : string | null;
}

export async function GetCloudinaryImage(args : IGetCloudinaryImage) : Promise<IGetCloudinaryImageOutput>
{
    try
    {
        const result = await Cloudinary.image(args.publicID, { secure: true });
        const urlMatch = result.match(/src='([^']+)'/);
        const url = urlMatch ? urlMatch[1] : '';

        return {
            imageURL : url,
            error : null
        };
    }
    catch (error) {
        return {
            imageURL : "",
            error : String(error)
        }
    }
}