"use server"

import { RefineEmail } from "@/helpers";
import { Cloudinary } from "@/lib/Cloudinary";

interface ICloudinaryDeleteResourcesInput {
    publicIDs: string[];
    email : string;
}

interface ICloudinaryDeleteResourcesOutput {
    success: boolean;
    error: any;
}

export async function CloudinaryDeleteResources({ publicIDs, email }: ICloudinaryDeleteResourcesInput): Promise<ICloudinaryDeleteResourcesOutput> {
    if(email.length < 5) {
        return {
            success: false,
            error: "Email Was Not Provided"
        };
    }
    
    if (publicIDs.length === 0) {
        return {
            success: true,
            error: null
        };
    }

    try {
        const result = await Cloudinary.api.delete_resources(publicIDs.map(publicID => `${RefineEmail(email)}/${publicID}`));

        if (result.deleted) {
            const failedDeletions = Object.values(result.deleted).filter(status => status !== 'deleted');

            if (failedDeletions.length === 0) {
                return {
                    success: true,
                    error: null
                };
            } else {
                return {
                    success: false,
                    error: `Some resources could not be deleted: ${failedDeletions.join(', ')}`
                };
            }
        } else {
            return {
                success: false,
                error: 'Unknown error occurred during deletion.'
            };
        }
    }
    catch (error) {
        return {
            success: false,
            error: error
        };
    }
}
