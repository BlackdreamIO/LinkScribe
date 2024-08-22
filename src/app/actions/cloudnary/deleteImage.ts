"use server"

import { Cloudinary } from "@/lib/Cloudinary";

interface IDeleteCloudinaryImage {
    publicID : string;
}
interface IDeleteCloudinaryImageOutput {
    sucess : boolean;
    error : any | null;
}


export async function DeleteCloudinaryImage({ publicID } : IDeleteCloudinaryImage) : Promise<IDeleteCloudinaryImageOutput>
{
    try
    {
        const result = await Cloudinary.uploader.destroy(publicID, { invalidate: true });

        return {
            sucess : result.public_id,
            error : null
        }
    }
    catch (error)
    {
        console.error(error);

        return {
            sucess : false,
            error : error
        }
    }
}