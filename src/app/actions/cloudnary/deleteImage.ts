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
        const result = await Cloudinary.uploader.destroy(publicID, { resource_type : "image", invalidate: true });

        return {
            sucess : result.result == "ok",
            error : result.result
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