import { Cloudinary, cloudinaryConfig } from "@/lib/Cloudinary";
import { ImageTransformationAndTagsOptions } from "cloudinary";

interface IGetImageURL {
    publicID : string;
    options? : ImageTransformationAndTagsOptions;
}
interface IGetImageURLOutput {
    url : string;
    error : any;
}
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

interface IuseCloudinaryOutput {
    GetImageURL : ({ publicID, options } : IGetImageURL) => Promise<IGetImageURLOutput>;
    UploadImageToCloudinary : ({ file, filename, folder } : IUploadImageToCloudinary) => Promise<IUploadImageToCloudinaryOuput>;
}

/**
 * Returns an object with two functions: `GetImageURL` and `UploadImageToCloudinary`.
 *
 * `GetImageURL` takes in an object with `publicID` and `options` and returns an object with `url` and `error`.
 * If the `publicID` is not provided, the `url` is an empty string and the `error` is `null`.
 *
 * `UploadImageToCloudinary` takes in an object with `file`, `filename`, and `folder` and returns an object with `publicID`, `imageURL`, and `error`.
 * If any of the required parameters (`file`, `filename`, `folder`) are missing, the `publicID` is an empty string, `imageURL` is an empty string, and the `error` is "Failed to upload image Missing Required Parameters".
 *
 * @return {IuseCloudinaryOutput} An object with two functions: `GetImageURL` and `UploadImageToCloudinary`.
 */
export function useCloudinary() : IuseCloudinaryOutput
{
    const GetImageURL = async ({ publicID, options } : IGetImageURL) => {
        try {
            const result = Cloudinary.image(publicID, { ...options });
            const urlMatch = result.match(/src='([^']+)'/);
            const url = urlMatch ? urlMatch[1] : '';
            return {
                url : url,
                error : null
            }
        }
        catch (error) {
            return {
                url : '',
                error : error
            }
        }
    }

    const UploadImageToCloudinary = async ({ file, filename, folder } : IUploadImageToCloudinary) => {

        try
        {
            if(file === null || filename === null || folder === null) {
                return {
                    publicID : "",
                    imageURL : "",
                    error : "Failed to upload image Missing Required Parameters"
                }
            }
            const options : ImageTransformationAndTagsOptions = {
                use_filename: true,
                unique_filename: true,
                overwrite: true,
                folder: folder,
            };
            const result = await Cloudinary.uploader.upload(file, options);
            const cldImage = Cloudinary.image(result.public_id);
            const urlMatch = cldImage.match(/src='([^']+)'/);
            const imageURL = urlMatch ? urlMatch[1] : '';

            return {
                publicID : result.public_id,
                imageURL : imageURL,
                error : null
            }
        }
        catch (error) {
            return {
                publicID : "",
                imageURL : "",
                error : error
            }
        }
    }

    return {
        GetImageURL,
        UploadImageToCloudinary
    }
}