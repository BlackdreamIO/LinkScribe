"use server"

import { RefineEmail } from "@/helpers"
import { Cloudinary } from "@/lib/Cloudinary"

interface Asset {
    asset_folder: string;
    asset_id: string;
    bytes: number;
    created_at: string;
    display_name: string;
    format: string;
    height: number;
    public_id: string;
    resource_type: string;
    secure_url: string;
    type: string;
    url: string;
    version: number;
    width: number;
}


interface ICloudinaryGetAllResourcesOutput {
    data : Asset[];
    error : any;
}

export async function CloudinaryGetAllResources({ email } : { email : string }) : Promise<ICloudinaryGetAllResourcesOutput>
{
    try
    {
        const result = await Cloudinary.api.resources({
            type : "upload",
            prefix : RefineEmail(email)
        })

        return {
            data : result.resources,
            error : null
        }
    }
    catch (error) {
        return {
            data : [],
            error : error
        }
    }
}