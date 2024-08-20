"use server"

import { Cloudinary } from "@/lib/Cloudinary";
import { UploadApiOptions } from "cloudinary";

interface IUploadImageToCloudinary {
    file : string;
    filename : string;
    folder : string;
}

interface IUploadImageToCloudinaryOuput {
    publicID : string;
    imageURL : string;
    error : any;
}


export async function UploadImageToCloudinary({ file, filename, folder } : IUploadImageToCloudinary)  : Promise<IUploadImageToCloudinaryOuput>
{

    
    //const file = formData.get("base64") as string;
    //const filename = formData.get("fileName") as string;
    //const folder = formData.get("folder") as string;

    if(file === null || filename === null || folder === null) {
        return {
            publicID : "",
            imageURL : "",
            error : "Failed to upload image Missing Required Parameters"
        }
    }

    const options : UploadApiOptions = {
        use_filename: true,
        unique_filename: true,
        overwrite: true,
        folder: folder,
    };

    try
    {

        console.log(file);

        const result = await Cloudinary.uploader.upload(file, options);
        const cldImage = Cloudinary.image(result.public_id);
//
        const urlMatch = cldImage.match(/src='([^']+)'/);
        const imageURL = urlMatch ? urlMatch[1] : '';

        return {
            publicID : result.public_id,
            imageURL : imageURL,
            error : null
        }
    }
    catch (error)
    {
        console.error(error);
        return {
            publicID : "",
            imageURL : "",
            error : error
        }
    }
}
